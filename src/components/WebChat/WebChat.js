/* eslint-disable max-lines-per-function */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactWebChat, { createDirectLine, createStore } from "botframework-webchat";
import * as Sentry from "@sentry/react";
import cx from "classnames";
import styles from "./WebChat.module.scss";
import "./WebChat.scss";
import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import useAnalytics from "hooks/useAnalytics";
import {useAuth0} from "@auth0/auth0-react";
import ChatIcon from "./askintegrity-logo.jpg";
import HideIcon from "./hide-icon.png";
import openAudio from "./open.mp3";
import closeAudio from "./close.mp3";
import Info from "components/icons/info-blue";
import useDeviceType from "hooks/useDeviceType";
import AskIntegrityFeedback from "./AskIntegrityInfoContainer/AskIntegrityFeedback";
import useFetch from "hooks/useFetch";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "lodash.debounce";
import styleOptions from "./webChatStyleOptions";
import SuggestedContacts from "./AutoComplete/SuggestedContacts";

const WebChatComponent = () => {

    const WHICH_CONTACT_PART_STRING = "Which contact would you like for your";
    const {getAccessTokenSilently} = useAuth0();
    const {npn, fullName} = useUserProfile();
    const showToast = useToast();
    const audioRefOpen = useRef(null);
    const audioRefClose = useRef(null);
    const chatRef = useRef(null);
    const {fireEvent} = useAnalytics();
    const {isDesktop} = useDeviceType();
    const [directLineToken, setDirectLineToken] = useState(null);
    const [showAskIntegrityFeedback, setShowAskIntegrityFeedback] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isContactsLoading, setIsContactsLoading] = useState(false);
    const [suggestedContacts, setSuggestedContacts] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);
    const [skipFeedbackInfo, setSkipFeedbackInfo] = useState(false);

    const {Get: getSuggestedContacts} = useFetch(
        `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Leads?Search=${searchText}&IncludeContactPreference=true&Sort=CreateDate:desc`
    );

    const showSelectContactPrompt = useCallback(() => {
        return lastMessage?.includes(WHICH_CONTACT_PART_STRING);
    }, [lastMessage]);

    useEffect(() => {
        const debouncedFetch = debounce(async () => {
            if (searchText.length > 1 && showSelectContactPrompt()) {
                setIsContactsLoading(true);
                try {
                    const suggestedContactsResponse = await getSuggestedContacts();
                    setSuggestedContacts(suggestedContactsResponse?.result || []);
                } finally {
                    setIsContactsLoading(false);
                }
            } else {
                setSuggestedContacts([]);
                setIsContactsLoading(false);
            }
        }, 500);

        debouncedFetch();

        return () => {
            debouncedFetch.cancel();
        };
    }, [searchText, lastMessage]);

    useEffect(() => {
        if (lastMessage?.includes(WHICH_CONTACT_PART_STRING)) {
            const inputElement = document.querySelector('[data-id="webchat-sendbox-input"]');
            if (inputElement) {
                inputElement.focus();
            }
        }
    }, [lastMessage]);

    const fetchDirectLineToken = useCallback(async () => {
        try {
            const response = await fetch(process.env.REACT_APP_DIRECT_LINE, {
                method: "POST",
                body: JSON.stringify({marketerId: npn}),
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

    const clearChat = useCallback(() => {
        const container = document.querySelector(".webchat__basic-transcript__transcript");
        if (container) {
            container.innerHTML = "";
        }
        setSuggestedContacts([]);
        setLastMessage("");
        setSearchText("");
        store.dispatch({
            type: "WEB_CHAT/SET_SEND_BOX",
            payload: {text: ""},
        });
    }, []);

    const clearChatAndFetchToken = useCallback(async () => {
        clearChat();
        await fetchDirectLineToken();
    }, [clearChat, fetchDirectLineToken]);

    const directLine = useMemo(() => createDirectLine({token: directLineToken}), [directLineToken]);

    const clearChatAndSendContact = useCallback((contactFullName, leadsId) => {
        setSuggestedContacts([]);
        setLastMessage("");
        setSearchText("");

        store.dispatch({
            type: "WEB_CHAT/SET_SEND_BOX",
            payload: { text: "" },
        });

        store.dispatch({
            type: "DIRECT_LINE/INCOMING_ACTIVITY",
            payload: {
                activity: {
                    type: "message",
                    from: { role: "user" },
                    text: `${contactFullName}`,
                },
            },
        });

        directLine
            .postActivity({
                name: "mc_Contact_Selected",
                type: "event",
                value: {
                    data: {
                        text: `You selected ${contactFullName}!`,
                        leadId: Number(leadsId),
                        contactName: contactFullName,
                        dialogId: "ContactSummary",
                        name: "mc_Contact_Selected",
                    },
                    appId: "mcweb",
                },
                channelId: "webchat",
            })
            .subscribe();
    }, [directLine]);


    const closeChat = useCallback(() => {
        clearChat();
        setShowAskIntegrityFeedback(false);
        setSearchText("");
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
        let intervalId;
        if (isChatActive) {
            intervalId = setInterval(() => {
                const inputElement = document.querySelector('[data-id="webchat-sendbox-input"]');
                if (inputElement) {
                    inputElement.setAttribute("maxLength", "100");
                    if (isDesktop) {
                        inputElement.focus();
                    }
                    clearInterval(intervalId);
                }
            }, 500);
        }
        return () => clearInterval(intervalId);
    }, [isChatActive, isDesktop]);

    useEffect(() => {
        if (isChatActive) {
            document.body.style.overflowY = "hidden";
        }
        return () => {
            document.body.style.overflowY = "auto";
        };
    }, [isChatActive]);

    const overrideLocalizedStrings = {TEXT_INPUT_PLACEHOLDER: showSelectContactPrompt() ? " Search for Contact..." : " Ask Integrity..."};

    const openChat = useCallback(async () => {
        fireEvent("AI - Ask Integrity Global Icon Clicked");
        setIsChatActive(true);
        clearChat();
        if (audioRefOpen.current) {
            audioRefOpen.current.play().catch((error) => {
                Sentry.captureException(error);
            });
        }
        await fetchDirectLineToken();
    }, [fireEvent, fetchDirectLineToken, clearChat]);

    const goToContactDetailPage = useCallback(
        (leadId) => {
            window.location.href = `${window.location.origin}/contact/${leadId}`;
            clearChat();
        },
        [clearChat],
    );

    const handleMessageActivity = useCallback(
        (activity, accessToken, dispatch) => {
            activity.text = activity.text || activity.value?.dropDownInfo || activity.value?.text;

            const channelData = activity.channelData || {};
            channelData.authToken = `Bearer ${accessToken}`;
            channelData.data = channelData.data || [];
            activity.channelData = channelData;

            const activityValue = activity.value;
            if (activityValue) {
                activity.channelData.postBack = false;
                if (activityValue.name === "mc_View_Contact") {
                    goToContactDetailPage(activityValue.leadId);
                } else if (activityValue.name === "mc_Redirect_Page") {
                    window.location.href = activityValue.url;
                } else if (activityValue.name === "mc_Leave_Feedback") {
                    setShowAskIntegrityFeedback(true);
                    setSkipFeedbackInfo(true);
                    setIsChatActive(false);
                } else if (activityValue.name === "mc_Ask_Something_Else") {
                    dispatch({
                        type: "WEB_CHAT/SEND_MESSAGE",
                        payload: {text: "Ask something else"},
                    });
                    const inputElement = document.querySelector('[data-id="webchat-sendbox-input"]');
                    if (inputElement) {
                        inputElement.focus();
                    }
                }
            }

            if (
                activityValue &&
                [
                    "mc_View_Call_Summary",
                    "mc_View_Transcript",
                    "mc_View_Contact",
                    "mc_Ask_Something_Else",
                    "mc_Search_Contact_Call",
                ].includes(activityValue.name)
            ) {
                activity.channelData.postBack = true;
                return true;
            }

            if (
                activityValue &&
                ["mc_Contact_Selected", "mc_Call_Selected", "mc_Search_Contact_Call"].includes(activityValue.name)
            ) {
                dispatch({
                    type: "WEB_CHAT/SEND_EVENT",
                    payload: {
                        name: activityValue.name,
                        value: {
                            data: activityValue,
                            appId: "mcweb",
                        },
                    },
                });
                return true;
            }
        },
        [clearChat, goToContactDetailPage],
    );

    const handleEventActivity = useCallback((activity) => {
        const activityValue = activity.value;
        if (activity.name === "mc_View_Contact") {
            window.open(`${window.location.origin}/contact/${activityValue.leadId}`);
        }
    }, []);

    const handlePostActivity = useCallback(
        async (action, dispatch) => {
            if (action?.meta === "imBack") {
                fireEvent("AI - Ask Integrity Playback Received", {
                    intent_name: action?.payload?.activity?.text,
                    message_card_id: action?.payload?.activity?.text,
                });
            }

            if (action?.payload?.activity?.value?.leadId) {
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
                fireEvent("AI - Ask Integrity Playback Received", {
                    leadid: action?.payload?.activity?.value?.data?.leadId,
                    message_card_id: action?.payload?.activity?.value?.data?.dialogId,
                });
            }

            const accessToken = await getAccessTokenSilently();
            const activity = action.payload.activity;

            if (activity.type === "message") {
                return handleMessageActivity(activity, accessToken, dispatch);
            } else if (activity.type === "event") {
               return handleEventActivity(activity);
            }
        },
        [fireEvent, getAccessTokenSilently, handleMessageActivity, handleEventActivity],
    );

    const handleIncomingActivity = useCallback(
        (action) => {
            const activity = action.payload.activity;

            if (activity?.attachments?.[0]) {
                fireEvent("AI - Ask Integrity Playback Received", {
                    leadid: activity.attachments[0]?.content?.actions?.[0]?.data?.leadId,
                    message_card_id: activity.attachments[0]?.content?.id,
                });
            }

            if (activity.type === "event" && activity.name === "mc_View_Contact") {
                goToContactDetailPage(activity.value.leadId);
            }
        },
        [fireEvent, goToContactDetailPage],
    );

    const store = useMemo(
        () =>
            createStore({}, ({dispatch}) => (next) => async (action) => {
                switch (action.type) {
                    case "WEB_CHAT/SET_SEND_BOX":
                        setSearchText(action.payload?.text || "");
                        break;
                    case "WEB_CHAT/SUBMIT_SEND_BOX":
                        fireEvent("AI - Ask Integrity Input Sent", {input_type: "text"});
                        break;

                    case "DIRECT_LINE/CONNECT_FULFILLED": {
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
                                    host: process.env.REACT_APP_BOT_HOST_NAME,
                                    hostUrl: process.env.REACT_APP_HOST_URL,
                                    appId: "mcweb",
                                },
                            },
                        });
                        break;
                    }

                    case "DIRECT_LINE/POST_ACTIVITY": {
                            const shouldPreventDefault = await handlePostActivity(action, dispatch);
                            if (shouldPreventDefault) {
                                return;
                            }
                        }
                        break;
                    case "DIRECT_LINE/INCOMING_ACTIVITY":
                        handleIncomingActivity(action);
                        if (action.payload?.activity?.text) {
                            setLastMessage(action.payload.activity.text);
                        }
                        break;

                    default:
                        break;
                }
                 next(action);
            }),
        [fullName, npn, fireEvent, getAccessTokenSilently, handlePostActivity, handleIncomingActivity],
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
                        skipFeedbackInfo={skipFeedbackInfo}
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
                    {[styles.active]: isChatActive},
                    {[styles.feedbackInfoSidebar]: showAskIntegrityFeedback},
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
                                    <Info/>
                                </span>
                            </p>
                            <img onClick={closeChat} className={styles.hideIcon} src={HideIcon} alt="Hide Icon"/>
                        </div>
                        {directLineToken && (
                            <div>
                                <SuggestedContacts
                                    suggestedContacts={suggestedContacts}
                                    isContactsLoading={isContactsLoading}
                                    onContactSelect={clearChatAndSendContact}
                                    initiateChat={openChat}
                                />

                                <div>
                                    <SearchIcon className="webchat-searchbox-icon" aria-label="search"
                                                edge="end"></SearchIcon>
                                    {directLine && (
                                        <ReactWebChat
                                            directLine={directLine}
                                            store={store}
                                            styleOptions={styleOptions}
                                            overrideLocalizedStrings={overrideLocalizedStrings}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            {!isChatActive && (
                <div onClick={openChat} className={styles.chatIconWrapper}>
                    <p className={styles.chatIconText}>Ask Integrity</p>
                    <img className={styles.chatIcon} src={ChatIcon} alt="Chat Icon"/>
                </div>
            )}
            <audio ref={audioRefOpen} src={openAudio}/>
            <audio ref={audioRefClose} src={closeAudio}/>
        </div>
    );
};

export default WebChatComponent;
