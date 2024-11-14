import PropTypes from "prop-types";
import { Box, Typography, Grid } from "@mui/material";
import { SendBlast, SendTrigger } from "@integritymarketing/icons";
import { styleEventDescription } from "utils/shared-utils/sharedUtility";
import styles from "./styles.module.scss";
import { useMemo } from "react";

const CampaignStatusInfoCard = ({ campaignStatus, campaignType, runDate, modifiedDate, customFilter }) => {
    const eventInfo = useMemo(() => {
        let customFilterData;
        try {
            const customFilterText = JSON.parse(customFilter);
            if (customFilterText) {
                customFilterData = JSON.parse(customFilterText);
            } else {
                customFilterData = {};
            }
        } catch (error) {
            customFilterData = {};
        }
        const { filteredContentStatus } = customFilterData;
        return filteredContentStatus || "";
    }, [customFilter]);
    return (
        <Box className={styles.sentStatusHeader}>
            <Box className={styles.sentHeaderBody}>
                <Grid container>
                    <Grid xs={12} md={6}>
                        <Typography variant="custom" className={styles.sentText}>
                            Sent: <span className={styles.sentDate}>{runDate}</span>
                        </Typography>
                    </Grid>
                    {campaignStatus === "Completed" && (
                        <Grid xs={12} md={6} sx={{ textAlign: { xs: "left", md: "end" } }}>
                            <Typography variant="custom" className={styles.sentText}>
                                Completed: <span className={styles.sentDate}> {runDate}</span>
                            </Typography>
                        </Grid>
                    )}
                    {campaignStatus === "Paused" && (
                        <Grid xs={12} md={6} sx={{ textAlign: { xs: "left", md: "end" } }}>
                            <Typography variant="custom" className={styles.sentText}>
                                Paused: <span className={styles.sentDate}> {modifiedDate}</span>
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
            <Box className={styles.cardDivider} />
            <Box className={styles.sentStatusBody}>
                {campaignType === "Event" && <SendTrigger size="md" className={styles.mIcon} />}
                {campaignType !== "Event" && <SendBlast size="md" className={styles.mIcon} />}
                &nbsp;
                <Typography variant="body1">
                    <span className={styles.sentText}>{campaignType === "Event" ? "When" : campaignType}: </span>
                    {campaignType === "Event" && (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: styleEventDescription(`${eventInfo}`, true),
                            }}
                        ></span>
                    )}
                    {campaignType !== "Event" && <span className={styles.sentMsg}>one-time send</span>}
                </Typography>
            </Box>
        </Box>
    );
};

CampaignStatusInfoCard.propTypes = {
    campaignStatus: PropTypes.string,
    campaignType: PropTypes.string,
    runDate: PropTypes.string.isRequired,
    modifiedDate: PropTypes.string.isRequired,
    customFilter: PropTypes.string.isRequired,
};

export default CampaignStatusInfoCard;
