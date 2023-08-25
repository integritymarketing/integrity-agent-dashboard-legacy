import React, { useEffect, useState, useMemo, useRef } from "react";
import ReactWebChat, {
  createDirectLine,
  createStore,
} from "botframework-webchat";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./WebChat.module.scss";
import ChatIcon from "./chat-icon.gif";
import HideIcon from "./hide-icon.png";
import cx from "classnames";
import "./WebChat.scss";
import useUserProfile from "hooks/useUserProfile";
import openAudio from './open.mp3';
import closeAudio from './close.mp3';

const WebChatComponent = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { agentId, fullName } = useUserProfile();
  const [directLineToken, setDirectLineToken] = useState(null);
  const [isChatActive, setIsChatActive] = useState(false);
  const audioRefOpen = useRef(null);
  const audioRefClose = useRef(null);

  useEffect(() => {
    const fetchDirectLineToken = async () => {
      const params = JSON.stringify({
        marketerId: 1178,
      });
      try {
        const response = await fetch(
          process.env.REACT_APP_DIRECT_LINE,
          { method: "POST", body: params }
        );
        if (response.ok) {
          const data = await response.json();
          setDirectLineToken(data.token);
        } else {
          console.error("Failed to fetch Direct Line token");
        }
      } catch (error) {
        console.error("Error fetching Direct Line token", error);
      }
    };

    fetchDirectLineToken();
  }, []);

  const directLine = useMemo(
    () => createDirectLine({ token: directLineToken }),
    [directLineToken]
  );

  const styleOptions = {
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
    sendBoxHeight: 125,
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
      });;
    }
  };
  
  const closeChat = () => {
    setIsChatActive(false);
    if (audioRefClose.current) {
      audioRefClose.current.play();
    }
  };

  const store = useMemo(
    () =>
      createStore({}, ({ dispatch }) => (next) => async (action) => {
        if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
          const accessToken = await getAccessTokenSilently();
          dispatch({
            type: "WEB_CHAT/SEND_EVENT",
            payload: {
              name: "webchat/join",
              value: {
                language: "en-US",
                marketerName: fullName,
                marketerId: agentId,
                authorization: `Bearer ${accessToken}`,
                host: "dev",
                hostUrl: process.env.REACT_APP_HOST_URL,
                appId: "mcweb",
              },
            },
          });
        } else if (action.type === 'DIRECT_LINE/POST_ACTIVITY') {
          const accessToken = await getAccessTokenSilently();
          if (action.payload.activity.type === 'message') {
            let message = action.payload.activity.text ? action.payload.activity.text : action.payload.activity.value.dropDownInfo;
            let activityValue = action.payload.activity.value;
            if (!message) {
              message = activityValue ? activityValue.text : message;
              action.payload.activity.text = message;
            }
            let channelData = action.payload.activity.channelData;
            let data = [];
            if (channelData) {
              channelData.authToken = `Bearer ${accessToken}`;
              channelData.data = data;
              action.payload.activity.channelData = channelData;
            } else {
              action.payload.activity.channelData = {
                authToken: `Bearer ${accessToken}`,
                data: data
              };
            }
            if (activityValue != null) {
              action.payload.activity.channelData.postBack = false;
            }
            if (activityValue != null && activityValue.name === 'mc_Contact_Selected') {
              return dispatch({
                type: 'WEB_CHAT/SEND_EVENT',
                payload: {
                  name: activityValue.name,
                  value: {
                    data: activityValue,
                    appId: 'mcweb'
                  }
                }
              });
            } else if (activityValue != null && activityValue.name === 'mc_View_Contact') {
              const leadId = activityValue.leadId;
              window.open(`${window.location.origin}/contact/${leadId}`);
            }
          }
        }
        return next(action);
      }),
    [agentId, fullName, getAccessTokenSilently]
  );

  return (
    <div className={styles.container}>
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
