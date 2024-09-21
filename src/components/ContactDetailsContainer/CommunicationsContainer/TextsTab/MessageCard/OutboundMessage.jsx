import PropTypes from "prop-types";
import ChatMessageOutgoing from "components/icons/version-2/ChatMessageOutgoing";
import DateTimeBox from "./DateTimeBox";
import styles from "./MessageCard.module.scss";

const OutboundMessage = ({ formattedDate, formattedTime, smsContent }) => (
    <div className={`${styles.messageBox} ${styles.outbound}`}>
        <div className={styles.iconAndContentBox}>
            <DateTimeBox formattedDate={formattedDate} formattedTime={formattedTime} />
            <div className={styles.messageTextBox}>{smsContent}</div>
        </div>
        <div className={styles.chatIconBox}>
            <ChatMessageOutgoing />
        </div>
    </div>
);

OutboundMessage.propTypes = {
    formattedDate: PropTypes.string.isRequired,
    formattedTime: PropTypes.string.isRequired,
    smsContent: PropTypes.string.isRequired,
};

export default OutboundMessage;