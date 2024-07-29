import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import ReactWebChat, { createDirectLine, createStore } from "botframework-webchat";
import * as Sentry from "@sentry/react";
import cx from "classnames";
import styles from "./WebChat.module.scss";
import "./WebChat.scss";
import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import useAnalytics from "hooks/useAnalytics";
import { useAuth0 } from "@auth0/auth0-react";
import ChatIcon from "./askintegrity-logo.jpg";
import HideIcon from "./hide-icon.png";
import openAudio from "./open.mp3";
import closeAudio from "./close.mp3";
import Info from "components/icons/info-blue";
import useDeviceType from "hooks/useDeviceType";
import AskIntegrityFeedback from "./AskIntegrityInfoContainer/AskIntegrityFeedback";

const WebChatComponent = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { npn, fullName } = useUserProfile();
    const showToast = useToast();
    const [directLineToken, setDirectLineToken] = useState(null);
    const [showAskIntegrityFeedback, setShowAskIntegrityFeedback] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false);
    const audioRefOpen = useRef(null);
    const audioRefClose = useRef(null);
    const chatRef = useRef(null);
    const { fireEvent } = useAnalytics();
    const { isDesktop } = useDeviceType();

    const fetchDirectLineToken = useCallback(async () => {
        try {
            const response = await fetch(process.env.REACT_APP_DIRECT_LINE, {
                method: "POST",
                body: JSON.stringify({ marketerId: npn }),
            });

            if (response.ok) {
                const data = await response.json();
                setDirectLineToken(data.token);
            }
        } catch (error) {
            Sentry.captureException(error);
            showToast({
                type: "error",
                message: "Error fetching Direct Line token.",
            });
        }
    }, [npn, showToast]);

    const clearChatAndFetchToken = useCallback(async () => {
        const container = document.querySelector(".webchat__basic-transcript__transcript");
        if (container) {
            container.innerHTML = "";
        }
        await fetchDirectLineToken();
    }, [fetchDirectLineToken]);

    const clearChat = useCallback(async () => {
        const container = document.querySelector(".webchat__basic-transcript__transcript");
        if (!container) {
            return;
        }
        container.innerHTML = "";
    }, []);

    const closeChat = useCallback(() => {
        clearChat();
        setShowAskIntegrityFeedback(false);
        if (isChatActive) {
            setIsChatActive(false);
            if (audioRefClose.current) {
                audioRefClose.current.play();
            }
        }
    }, [clearChat, isChatActive]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                closeChat();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeChat]);

    useEffect(() => {
        if (isChatActive) {
            const intervalId = setInterval(() => {
                const inputElement = document.querySelector('[data-id="webchat-sendbox-input"]');
                if (inputElement) {
                    inputElement.setAttribute("maxLength", "100");
                    if (isDesktop) {inputElement.focus();}
                    clearInterval(intervalId);
                }
            }, 500);

            return () => clearInterval(intervalId);
        }
    }, [isChatActive, isDesktop]);

    useEffect(() => {
        if (isChatActive) {
            document.body.style.overflowY = "hidden";
        }
        return () => {
            document.body.style.overflowY = "auto";
        };
    }, [isChatActive]);

    const directLine = useMemo(() => createDirectLine({ token: directLineToken }), [directLineToken]);

    const styleOptions = {
        autoScrollSnapOnPage: true,
        backgroundColor: "#1D3E71",
        bubbleBackground: "#375582",
        bubbleFromUserBackground: "#375582",
        bubbleBorderWidth: 0,
        bubbleFromUserBorderWidth: 0,
        bubbleTextColor: "#fff",
        bubbleFromUserTextColor: "#fff",
        sendBoxBackground: "#052A63",
        sendBoxButtonColor: "#fff",
        sendBoxTextColor: "#fff",
        sendBoxHeight: 80,
        hideUploadButton: true,
        sendBoxPlaceholderColor: "#ffffffcc",
        sendBoxButtonShadeColorOnActive: "transparent",
        sendBoxButtonShadeColorOnFocus: "transparent",
        sendBoxButtonShadeColorOnHover: "transparent",
        timestampColor: "#fff",
        sendBoxBorderTop: 0,
        fontTypes: {
            default: {
                fontFamily: "'Lato', sans-serif",
                fontSizes: {
                    small: 12,
                    default: 16,
                    medium: 16,
                    large: 24,
                    extraLarge: 26,
                },
            },
        },
        spacing: {
            small: 2,
        },
    };

    const overrideLocalizedStrings = {
        TEXT_INPUT_PLACEHOLDER: "Ask Integrity",
    };

    const openChat = useCallback(async () => {
        fireEvent("AI - Ask Integrity Global Icon Clicked");
        setIsChatActive(true);
        const container = document.querySelector(".webchat__basic-transcript__transcript");
        if (container) {
            container.innerHTML = "";
        }
        if (audioRefOpen.current) {
            audioRefOpen.current.play().catch((error) => {
                Sentry.captureException(error);
            });
        }
        await fetchDirectLineToken();
    }, [fireEvent, fetchDirectLineToken]);

    const goToContactDetailPage = useCallback(
        (leadId) => {
            window.location.href = `${window.location.origin}/contact/${leadId}`;
            clearChat();
        },
        [clearChat]
    );

    const store = useMemo(
        () =>
            createStore({}, ({ dispatch }) => (next) => async (action) => {
                if (action.type === "WEB_CHAT/SUBMIT_SEND_BOX") {
                    fireEvent("AI - Ask Integrity Input Sent", { input_type: "text" });
                }
                if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
                    const accessToken = await getAccessTokenSilently();
                    dispatch({
                        type: "WEB_CHAT/SEND_EVENT",
                        payload: {
                            name: "webchat/join",
                            value: {
                                language: "en-US",
                                marketerName: fullName,
                                marketerId: npn,
                                authorization: `Bearer ${accessToken}`,
                                host: "dev",
                                hostUrl: process.env.REACT_APP_HOST_URL,
                                appId: "mcweb",
                            },
                        },
                    });
                } else if (action.type === "DIRECT_LINE/POST_ACTIVITY") {
                    console.log("inside post activity", action);
                    if (action?.meta === "imBack") {
                        console.log("inside intents", action);
                        fireEvent("AI - Ask Integrity Playback Received", {
                            intent_name: action?.payload?.activity?.text,
                            message_card_id: action?.payload?.activity?.text,
                        });
                    }
                    if (action?.payload?.activity?.value?.leadId) {
                        console.log("inside AI - Ask Integrity CTA Clicked", action);
                        fireEvent("AI - Ask Integrity CTA Clicked", {
                            leadid: action?.payload?.activity?.value?.leadId,
                            cta_name: action?.payload?.activity?.value?.name,
                            intent_name: action?.payload?.activity?.value?.dialogId,
                            message_card_id: action?.payload?.activity?.value?.dialogId,
                        });
                    }
                    if (
                        action?.payload?.activity?.name !== "webchat/join" &&
                        action?.payload?.activity?.value?.data?.dialogId
                    ) {
                        console.log("inside AI - Ask Integrity Playback Received", action);
                        fireEvent("AI - Ask Integrity Playback Received", {
                            leadid: action?.payload?.activity?.value?.data?.leadId,
                            message_card_id: action?.payload?.activity?.value?.data?.dialogId,
                        });
                    }
                    const accessToken = await getAccessTokenSilently();
                    if (action.payload.activity.type === "message") {
                        let message = action.payload.activity.text
                            ? action.payload.activity.text
                            : action.payload.activity.value.dropDownInfo;
                        const activityValue = action.payload.activity.value;
                        if (!message) {
                            message = activityValue ? activityValue.text : message;
                            action.payload.activity.text = message;
                        }
                        const channelData = action.payload.activity.channelData;
                        const data = [];
                        if (channelData) {
                            channelData.authToken = `Bearer ${accessToken}`;
                            channelData.data = data;
                            action.payload.activity.channelData = channelData;
                        } else {
                            action.payload.activity.channelData = {
                                authToken: `Bearer ${accessToken}`,
                                data: data,
                            };
                        }
                        if (activityValue != null) {
                            action.payload.activity.channelData.postBack = false;
                        }
                        if (
                            activityValue != null &&
                            (activityValue.name === "mc_View_Call_Summary" ||
                                activityValue.name === "mc_View_Transcript" ||
                                activityValue.name === "mc_View_Contact" || activityValue.name === "mc_Ask_Something_Else")
                        ) {
                            action.payload.activity.channelData.postBack = true;
                        }

                        if (activityValue != null && (activityValue.name === "mc_Contact_Selected" || activityValue.name === "mc_Call_Selected"|| activityValue.name === "mc_Search_Contact")) {
                            return dispatch({
                                type: "WEB_CHAT/SEND_EVENT",
                                payload: {
                                    name: activityValue.name,
                                    value: {
                                        data: activityValue,
                                        appId: "mcweb",
                                    },
                                },
                            });
                        }
                    } else if (action.payload.activity.type === "event") {
                        const activityValue = action.payload.activity.value;
                        if (action.payload.activity.name === "mc_View_Contact") {
                            const leadId = activityValue.leadId;
                            window.open(`${window.location.origin}/contact/${leadId}`);
                        }
                    }
                } else if (action.type === "DIRECT_LINE/INCOMING_ACTIVITY") {
                    if (action?.payload?.activity?.attachments?.[0]) {
                        fireEvent("AI - Ask Integrity Playback Received", {
                            leadid: action?.payload?.activity?.attachments?.[0]?.content?.actions?.[0]?.data?.leadId,
                            message_card_id: action?.payload?.activity?.attachments?.[0]?.content?.id,
                        });
                    }
                    if (action.payload.activity.type === "event") {
                        const activityValue = action.payload.activity.value;
                        if (activityValue !== null && action.payload.activity.name === "mc_View_Contact") {
                            const leadId = activityValue.leadId;
                            goToContactDetailPage(leadId);
                        }
                    }
                }
                return next(action);
            }),
        [fullName, npn, fireEvent, goToContactDetailPage]
    );

    const handleOpenAskIntegrityFeedback = () => {
        setShowAskIntegrityFeedback(true);
        setIsChatActive(false);
    };

    const handleCloseAskIntegrityFeedback = () => {
        setShowAskIntegrityFeedback(false);
        setIsChatActive(false);
    };

    if (showAskIntegrityFeedback) {
        return (
            <div id="webchat" ref={chatRef} className={styles.askIntegrityChatSidebar}>
                <div className={styles.askIntegrityContent}>
                    <AskIntegrityFeedback
                        onClose={handleCloseAskIntegrityFeedback}
                        onDone={() => {
                            setShowAskIntegrityFeedback(false);
                            setIsChatActive(false);
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container} ref={chatRef}>
            <div
                id="webchat"
                className={cx(
                    styles.chatSidebar,
                    { [styles.active]: isChatActive },
                    { [styles.feedbackInfoSidebar]: showAskIntegrityFeedback }
                )}
            >
                {!showAskIntegrityFeedback && (
                    <>
                        <div className={styles.header}>
                            <img
                                className={styles.logoIcon}
                                onClick={clearChatAndFetchToken}
                                src={ChatIcon}
                                alt="Chat Icon"
                            />
                            <p className={styles.headerText}>
                                <span>Ask Integrity</span>
                                <span className={styles.infoLogo} onClick={handleOpenAskIntegrityFeedback}>
                                    <Info />
                                </span>
                            </p>
                            <img onClick={closeChat} className={styles.hideIcon} src={HideIcon} alt="Hide Icon" />
                        </div>
                        {directLineToken && (
                            <ReactWebChat
                                store={store}
                                directLine={directLine}
                                styleOptions={styleOptions}
                                overrideLocalizedStrings={overrideLocalizedStrings}
                            />
                        )}
                    </>
                )}
            </div>
            {!isChatActive && (
                <div onClick={openChat} className={styles.chatIconWrapper}>
                    <p className={styles.chatIconText}>Ask Integrity</p>
                    <img className={styles.chatIcon} src={ChatIcon} alt="Chat Icon" />
                </div>
            )}
            <audio ref={audioRefOpen} src={openAudio} />
            <audio ref={audioRefClose} src={closeAudio} />
        </div>
    );
};

export default WebChatComponent;
