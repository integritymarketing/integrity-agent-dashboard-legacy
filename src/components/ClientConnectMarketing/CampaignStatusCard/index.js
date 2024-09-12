import PropTypes from "prop-types";
import { Box, Typography, Grid, useMediaQuery, useTheme } from "@mui/material";
import EmailIcon from "components/icons/Marketing/emailIcon";
import CampaignStatusInfoCard from "../CampaignStatusInfoCard";
import CampaignMetricCard from "../CampaignMetricCard";
import truncateText from "utils/truncateText";
import styles from "./styles.module.scss";
import {
    MetricRecipients,
    MetricOpens,
    MetricClicks,
    MetricUnsubscribes,
    CampaignTypeTextMessage,
    CampaignTypeEmail,
    CampaignActionsEllipsis,
} from "@integritymarketing/icons";

const CampaignStatusCard = ({ campaign }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { campaignChannel, customCampaignDescription, campaignStatus, campaignType, formattedDate, requestPayload } =
        campaign;

    const statusInfo = [
        { name: "Recipients", value: "1,300", sPercentage: "", icon: MetricRecipients },
        { name: "Opens", value: "550", sPercentage: "42%", icon: MetricOpens },
        { name: "Clicks", value: "72", sPercentage: "5%", icon: MetricClicks },
        { name: "Unsubscribes", value: "11", sPercentage: "0.8%", icon: MetricUnsubscribes },
    ];

    return (
        <Box className={styles.campaignCardContainer}>
            <Box className={styles.campaignCard}>
                <Box className={styles.cardHeader}>
                    <Box className={styles.cardType}>
                        {campaignChannel === "Email" ? (
                            <CampaignTypeEmail size="lg" className={styles.mIcon} />
                        ) : (
                            <CampaignTypeTextMessage size="lg" className={styles.mIcon} />
                        )}
                        <Typography className={styles.campaignTitle} variant="h4">
                            {truncateText(customCampaignDescription, isSmallScreen ? 18 : 45)}
                        </Typography>
                    </Box>
                    <CampaignActionsEllipsis size="lg" className={styles.mIcon} />
                </Box>
                <Box className={styles.cardDivider} />
                <Box className={styles.cardDetails}>
                    <Box className={styles.cardLabel}>
                        I want to send an {campaignChannel.toLowerCase()} to
                        <span className={styles.cardValue}>
                            {" "}
                            {customCampaignDescription} to {requestPayload?.leads[0]?.firstName}{" "}
                            {requestPayload?.leads[0]?.lastName}
                        </span>
                    </Box>
                </Box>
            </Box>
            {campaignStatus !== "Draft" && (
                <Box sx={{ padding: "16px" }}>
                    <Box className={styles.statusCard}>
                        <CampaignStatusInfoCard
                            date={formattedDate}
                            campaignStatus={campaignStatus}
                            campaignType={campaignType}
                            icon={EmailIcon}
                        />
                    </Box>
                    {statusInfo.length > 0 && (
                        <Box className={styles.clicksCardsContainer}>
                            <Grid container spacing={1}>
                                {statusInfo.map((item, index) => (
                                    <Grid item xs={6} md={6} key={index}>
                                        <CampaignMetricCard
                                            key={index}
                                            name={item.name}
                                            value={item.value}
                                            sPercentage={item.sPercentage}
                                            icon={item.icon}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

CampaignStatusCard.propTypes = {
    campaign: PropTypes.shape({
        campaignChannel: PropTypes.string.isRequired,
        campaignType: PropTypes.string.isRequired,
        campaignStatus: PropTypes.string.isRequired,
        campaignRunDate: PropTypes.string.isRequired,
        customCampaignDescription: PropTypes.string.isRequired,
        formattedDate: PropTypes.string,
        requestPayload: PropTypes.shape({
            leads: PropTypes.arrayOf(
                PropTypes.shape({
                    firstName: PropTypes.string,
                    lastName: PropTypes.string,
                }),
            ),
        }),
        sentDate: PropTypes.string,
        trigger: PropTypes.string,
        stats: PropTypes.shape({
            recipients: PropTypes.number,
            opens: PropTypes.number,
            clicks: PropTypes.number,
            unsubscribes: PropTypes.number,
        }),
    }).isRequired,
};

export default CampaignStatusCard;
