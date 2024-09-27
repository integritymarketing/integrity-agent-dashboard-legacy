import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DateTimeBox from "./DateTimeBox";
import styles from "./MessageCard.module.scss";
import { Button } from "@mui/material";
import BroadCast from "components/icons/version-2/Broadcast";
import ArrowRightCircle from "components/icons/version-2/ArrowRightCircle";

const formatSmsContent = (smsContent) => {
    return smsContent
        .replace(/\r/g, '• ')
        .replace(/\n/g, '<br />');
};

const FreeFormMessage = ({ formattedDate, formattedTime, hasViewed, campaignLogId, smsContent }) => {
    const navigate = useNavigate();

    const handleViewCampaign = () => {
        navigate(`/marketing/campaign-details/${campaignLogId}`);
    };

    return (
        <div className={`${styles.messageBox} ${!hasViewed ? styles.isUnread : ""}`}>
            <div className={styles.messageTextBoxBroadcast}>
                <DateTimeBox formattedDate={formattedDate} formattedTime={formattedTime} />
            </div>
            <div className={styles.smsContent} dangerouslySetInnerHTML={{ __html: formatSmsContent(smsContent) }}></div>
            <div className={styles.chatIconBoxBroadcast}>
                <BroadCast />
                {campaignLogId && (
                    <div className={styles.sendCampaignButton}>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowRightCircle />}
                            onClick={handleViewCampaign}
                        >
                            View campaign
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

FreeFormMessage.propTypes = {
    formattedDate: PropTypes.string.isRequired,
    formattedTime: PropTypes.string.isRequired,
    hasViewed: PropTypes.bool.isRequired,
    campaignLogId: PropTypes.string,
    smsContent: PropTypes.string.isRequired,
};

export default FreeFormMessage;