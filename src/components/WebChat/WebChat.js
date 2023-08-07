import React, { useEffect, useState, useMemo, useRef } from "react";
import ReactWebChat, { createDirectLine } from "botframework-webchat";
import styles from "./WebChat.module.scss";
import ChatIcon from "./chat-icon.gif";
import HideIcon from "./hide-icon.png";
import cx from "classnames";
import "./WebChat.scss";

const WebChatComponent = () => {
  const [directLineToken, setDirectLineToken] = useState(null);

  const [isChatActive, setIsChatActive] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchDirectLineToken = async () => {
      const params = JSON.stringify({
        marketerId: 1178,
      });
      try {
        const response = await fetch(
          "https://integrity-bot-service-dev.azurewebsites.net/directline/token",
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
    audioRef.current.play();
  };

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
            onClick={() => setIsChatActive(false)}
            className={styles.hideIcon}
            src={HideIcon}
            alt="Hide Icon"
          />
        </div>
        {directLineToken && (
          <ReactWebChat
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
      <audio ref={audioRef} src="./sound.mov" />
    </div>
  );
};

export default WebChatComponent;
