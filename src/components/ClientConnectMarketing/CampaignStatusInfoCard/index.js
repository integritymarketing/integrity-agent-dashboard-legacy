import PropTypes from "prop-types";
import { Box, Typography, Grid } from "@mui/material";
import { SendBlast } from "@integritymarketing/icons";
import styles from "./styles.module.scss";

const CampaignStatusInfoCard = ({ icon: IconComponent, date, campaignStatus, campaignType }) => {
    return (
        <Box className={styles.sentStatusHeader}>
            <Box className={styles.sentHeaderBody}>
                <Grid container>
                    <Grid xs={12} md={6}>
                        <Typography variant="custom" className={styles.sentText}>
                            Sent: <span className={styles.sentDate}> {date}</span>
                        </Typography>
                    </Grid>
                    {campaignStatus === "Completed" && (
                        <Grid xs={12} md={6} sx={{ textAlign: { xs: "left", md: "end" } }}>
                            <Typography variant="custom" className={styles.sentText}>
                                Completed <span className={styles.sentDate}> {date}</span>
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
            <Box className={styles.cardDivider} />
            <Box className={styles.sentStatusBody}>
                <SendBlast color="black" size="md" className={styles.mIcon} /> &nbsp;
                <Typography variant="body1">
                    <span className={styles.sentText}>{campaignStatus !== "Active" ? campaignType : "When"}:</span>
                    <span className={styles.sentMsg}>one-time send</span>
                </Typography>
            </Box>
        </Box>
    );
};

CampaignStatusInfoCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    date: PropTypes.string,
    campaignStatus: PropTypes.string,
    campaignType: PropTypes.string,
};

export default CampaignStatusInfoCard;
