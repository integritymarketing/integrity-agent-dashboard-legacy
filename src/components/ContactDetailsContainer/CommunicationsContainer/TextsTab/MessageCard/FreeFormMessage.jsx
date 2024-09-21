import PropTypes from "prop-types";
import DateTimeBox from "./DateTimeBox";
import styles from "./MessageCard.module.scss";
import { Button } from "@mui/material";
import BroadCast from "components/icons/version-2/Broadcast";
import ArrowRightCircle from "components/icons/version-2/ArrowRightCircle";

const FreeFormMessage = ({ formattedDate, formattedTime, hasViewed }) => (
    <div className={`${styles.messageBox} ${!hasViewed ? styles.isUnread : ""}`}>
        <div className={styles.messageTextBoxBroadcast}>
            <DateTimeBox formattedDate={formattedDate} formattedTime={formattedTime} />
            [Campaign specific messaging goes here]
        </div>
        <div className={styles.chatIconBoxBroadcast}>
            <BroadCast />
            <div className={styles.sendCampaignButton}>
                <Button variant="contained" color="primary" endIcon={<ArrowRightCircle />} onClick={() => {}}>
                    View campaign
                </Button>
            </div>
        </div>
    </div>
);

FreeFormMessage.propTypes = {
    formattedDate: PropTypes.string.isRequired,
    formattedTime: PropTypes.string.isRequired,
    hasViewed: PropTypes.bool.isRequired,
};

export default FreeFormMessage;