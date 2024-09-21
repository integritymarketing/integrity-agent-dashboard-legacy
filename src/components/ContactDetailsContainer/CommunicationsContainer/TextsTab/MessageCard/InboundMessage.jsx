import PropTypes from "prop-types";
import DateTimeBox from "./DateTimeBox";
import ChatMessage from "components/icons/version-2/ChatMessage";
import styles from "./MessageCard.module.scss";

const InboundMessage = ({ formattedDate, formattedTime, smsContent, hasViewed }) => (
    <div className={`${styles.messageBox} ${styles.inbound} ${!hasViewed ? styles.isUnread : ""}`}>
        <div className={styles.iconAndContentBox}>
            <div className={styles.chatIconBox}>
                <ChatMessage />
            </div>
            <DateTimeBox formattedDate={formattedDate} formattedTime={formattedTime} />
        </div>
        <div className={styles.messageTextBox}>{smsContent}</div>
    </div>
);

InboundMessage.propTypes = {
    formattedDate: PropTypes.string.isRequired,
    formattedTime: PropTypes.string.isRequired,
    smsContent: PropTypes.string.isRequired,
    hasViewed: PropTypes.bool.isRequired,
};

export default InboundMessage;