import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import ReactWebChat, { createDirectLine, createStore } from 'botframework-webchat';
import * as Sentry from '@sentry/react';
import cx from 'classnames';
import styles from './WebChat.module.scss';
import './WebChat.scss';
import useUserProfile from 'hooks/useUserProfile';
import useToast from 'hooks/useToast';
import authService from 'services/authService';
import ChatIcon from './askintegrity-logo.png';
import HideIcon from './hide-icon.png';
import openAudio from './open.mp3';
import closeAudio from './close.mp3';

const WebChatComponent = () => {
  const { npn, fullName } = useUserProfile();
  const addToast = useToast();
  const [directLineToken, setDirectLineToken] = useState(null);
  const [isChatActive, setIsChatActive] = useState(false);
  const audioRefOpen = useRef(null);
  const audioRefClose = useRef(null);
  const chatRef = useRef(null);

  const fetchDirectLineToken = useCallback(async () => {
    try {
      const response = await fetch(process.env.REACT_APP_DIRECT_LINE, {
        method: 'POST',
        body: JSON.stringify({ marketerId: npn }),
      });

      if (response.ok) {
        const data = await response.json();
        setDirectLineToken(data.token);
      }
    } catch (error) {
      Sentry.captureException(error);
      addToast({
        type: 'error',
        message: 'Error fetching Direct Line token.',
      });
    }
  }, [npn, addToast]);

  useEffect(() => {
    fetchDirectLineToken();
  }, [fetchDirectLineToken]);

  const closeChat = useCallback(() => {
    if (isChatActive) {
      setIsChatActive(false);
      if (audioRefClose.current) {
        audioRefClose.current.play();
      }
    }
  }, [isChatActive]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        closeChat();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeChat]);

  const directLine = useMemo(
    () => createDirectLine({ token: directLineToken }),
    [directLineToken]
  );

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
  };

  const overrideLocalizedStrings = {
    TEXT_INPUT_PLACEHOLDER: "Ask Integrity",
  };

  const openChat = () => {
    setIsChatActive(true);
    if (audioRefOpen.current) {
      audioRefOpen.current.play().catch((error) => {
        console.error("Error playing open audio:", error);
      });
    }
  };

  const goToContactDetailPage = useCallback((leadId) => {
    window.open(`${window.location.origin}/contact/${leadId}`, "_blank");
  }, []);

  const store = useMemo(
    () =>
      createStore({}, ({ dispatch }) => (next) => async (action) => {
        if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
          const accessToken = await authService.getUser();
          dispatch({
            type: "WEB_CHAT/SEND_EVENT",
            payload: {
              name: "webchat/join",
              value: {
                language: "en-US",
                marketerName: fullName,
                marketerId: npn,
                authorization: `Bearer ${accessToken.access_token}`,
                host: "dev",
                hostUrl: process.env.REACT_APP_HOST_URL,
                appId: "mcweb",
              },
            },
          });
        } else if (action.type === "DIRECT_LINE/POST_ACTIVITY") {
          const accessToken = await authService.getUser();
          if (action.payload.activity.type === "message") {
            let message = action.payload.activity.text
              ? action.payload.activity.text
              : action.payload.activity.value.dropDownInfo;
            let activityValue = action.payload.activity.value;
            if (!message) {
              message = activityValue ? activityValue.text : message;
              action.payload.activity.text = message;
            }
            let channelData = action.payload.activity.channelData;
            let data = [];
            if (channelData) {
              channelData.authToken = `Bearer ${accessToken.access_token}`;
              channelData.data = data;
              action.payload.activity.channelData = channelData;
            } else {
              action.payload.activity.channelData = {
                authToken: `Bearer ${accessToken.access_token}`,
                data: data,
              };
            }
            if (activityValue != null) {
              action.payload.activity.channelData.postBack = false;
            }
            if (
              activityValue != null &&
              activityValue.name === "mc_Contact_Selected"
            ) {
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
            let activityValue = action.payload.activity.value;
            if (action.payload.activity.name === "mc_View_Contact") {
              const leadId = activityValue.leadId;
              window.open(`${window.location.origin}/contact/${leadId}`);
            }
          }
        } else if (action.type === "DIRECT_LINE/INCOMING_ACTIVITY") {
          if (action.payload.activity.type === "event") {
            let activityValue = action.payload.activity.value;
            if (
              activityValue !== null &&
              action.payload.activity.name === "mc_View_Contact"
            ) {
              const leadId = activityValue.leadId;
              goToContactDetailPage(leadId);
            }
          }
        }
        return next(action);
      }),
    [npn, fullName, goToContactDetailPage]
  );

  return (
    <div className={styles.container} ref={chatRef}>
      <div
        id="webchat"
        className={cx(styles.chatSidebar, { [styles.active]: isChatActive })}
      >
        <div className={styles.header}>
          <img src={ChatIcon} alt="Chat Icon" />
          <p className={styles.headerText}>Ask Integrity</p>
          <img
            onClick={closeChat}
            className={styles.hideIcon}
            src={HideIcon}
            alt="Hide Icon"
          />
        </div>
        {directLineToken && (
          <ReactWebChat
            store={store}
            directLine={directLine}
            styleOptions={styleOptions}
            overrideLocalizedStrings={overrideLocalizedStrings}
          />
        )}
      </div>
      {directLineToken && !isChatActive && (
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
