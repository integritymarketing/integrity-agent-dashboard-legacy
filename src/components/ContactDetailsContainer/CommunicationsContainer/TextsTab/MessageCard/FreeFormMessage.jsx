import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DateTimeBox from "./DateTimeBox";
import styles from "./MessageCard.module.scss";
import { Button, Grid } from "@mui/material";
import BroadCast from "components/icons/version-2/Broadcast";
import ArrowRightCircle from "components/icons/version-2/ArrowRightCircle";
const FreeFormMessage = ({ formattedDate, formattedTime, hasViewed, campaignLogId, smsContent }) => {
    const navigate = useNavigate();

    const handleViewCampaign = () => {
        navigate(`/marketing/campaign-details/${campaignLogId}`);
    };

    return (
        <div className={`${styles.messageBox} ${!hasViewed ? styles.isUnread : ""}`}>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <div className={styles.messageTextBoxBroadcast}>
                        <DateTimeBox formattedDate={formattedDate} formattedTime={formattedTime} />
                    </div>
                </Grid>
                <Grid item xs={7}>
                    {smsContent && <div dangerouslySetInnerHTML={{ __html: smsContent }}></div>}
                </Grid>
                <Grid item xs={3}>
                    <div>
                        <BroadCast />
                        {campaignLogId && (
                            <Button
                                className={styles.viewCampaignButton}
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowRightCircle />}
                                onClick={handleViewCampaign}
                            >
                                View campaign
                            </Button>
                        )}
                    </div>
                </Grid>
            </Grid>
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