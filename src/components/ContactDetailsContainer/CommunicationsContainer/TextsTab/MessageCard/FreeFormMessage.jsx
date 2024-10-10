import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DateTimeBox from "./DateTimeBox";
import { Button, Grid } from "@mui/material";
import styles from "./MessageCard.module.scss";
import BroadCast from "components/icons/version-2/Broadcast";
import ArrowRightCircle from "components/icons/version-2/ArrowRightCircle";
import { useWindowSize } from "hooks/useWindowSize";

const FreeFormMessage = ({ formattedDate, formattedTime, hasViewed, campaignLogId, smsContent }) => {
    const navigate = useNavigate();
    const { width: windowWidth } = useWindowSize();
    const isMobile = windowWidth <= 784;

    const handleViewCampaign = () => {
        navigate(`/marketing/campaign-details/${campaignLogId}`);
    };

    return (
        <div className={`${styles.messageBox} ${!hasViewed ? styles.isUnread : ""}`}>
            <Grid container spacing={1}>
                <Grid item xs={3} md={2}>
                    <div className={styles.messageTextBoxBroadcast}>
                        <DateTimeBox formattedDate={formattedDate} formattedTime={formattedTime} />
                    </div>
                </Grid>
                <Grid item xs={7} md={7}>
                    {smsContent && <div className={styles.wrappedContent} dangerouslySetInnerHTML={{ __html: smsContent }}></div>}
                </Grid>
                {isMobile && (
                    <Grid item xs={2}>
                        <div>
                            <BroadCast />
                        </div>
                    </Grid>
                )}
                <Grid marginLeft={"auto"} item xs={0} md={3}>
                    <div className={styles.broadCastContainer}>
                        {!isMobile && <BroadCast />}
                        {campaignLogId && (
                            <div className={styles.viewCampaignButton}>
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
