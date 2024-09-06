import React from "react";
import PropTypes from "prop-types";
import ChatMessage from "components/icons/version-2/ChatMessage";
import BroadCast from "components/icons/version-2/Broadcast";
import { Button } from "@mui/material";
import ArrowRightCircle from "components/icons/version-2/ArrowRightCircle";

import styles from "./MessageCard.module.scss";

const MessageCard = ({ type }) => {
    if (type === "MY_TEXT_MESSAGE") {
        return (
            <div className={styles.messageBox}>
                <div className={styles.dateTimeBox}>
                    <span className={styles.timeText}>5/25/24</span>
                    <br />
                    4:19 pm
                </div>
                <div className={styles.messageTextBox}>
                    It is a long established fact that a reader will be distracted by the readable content of a page
                    when looking at its layout.
                </div>
                <div className={styles.chatIconBox}>
                    <ChatMessage />
                </div>
            </div>
        );
    } else if (type === "MY_BROADCAST_MESSAGE") {
        return (
            <div className={styles.messageBox}>
                <div className={styles.messageTextBoxBroadcast}>
                    <div className={styles.dateTimeBox}>
                        <span className={styles.timeText}>5/25/24</span>
                        <br />
                        4:19 pm
                    </div>
                    [Campaign specific messaging goes here]
                </div>
                <div className={styles.chatIconBoxBroadcast}>
                    <BroadCast />
                    <div className={styles.sendNewTextButton}>
                        <Button variant="contained" color="primary" endIcon={<ArrowRightCircle />} onClick={() => {}}>
                            View campaign
                        </Button>
                    </div>
                </div>
            </div>
        );
    } else if (type === "SYSTEM_TEXT_MESSAGE") {
        return (
            <div className={`${styles.messageBox} ${styles.messageBoxSystem}`}>
                <div className={styles.chatIconBox}>
                    <ChatMessage />
                </div>
                <div className={styles.dateTimeBox}>
                    <span className={styles.timeText}>5/25/24</span>
                    <br />
                    4:19 pm
                </div>
                <div className={styles.messageTextBox}>
                    It is a long established fact that a reader will be distracted by the readable content of a page
                    when looking at its layout.
                </div>
            </div>
        );
    }
    return null;
};

MessageCard.propTypes = {
    type: PropTypes.string.isRequired,
};

export default MessageCard;
