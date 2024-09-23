import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, useMediaQuery, useTheme, IconButton } from "@mui/material";
import EmailIcon from "components/icons/Marketing/emailIcon";
import CampaignStatusInfoCard from "../CampaignStatusInfoCard";
import CampaignMetricCard from "../CampaignMetricCard";
import truncateText from "utils/truncateText";
import styles from "./styles.module.scss";
import ActionPopoverContainer from "../ActionPopover";

import { CampaignTypeTextMessage, CampaignTypeEmail } from "@integritymarketing/icons";

const CampaignStatusCard = ({ campaign }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        campaignChannel,
        customCampaignDescription,
        campaignStatus,
        campaignType,
        formattedDate,
        requestPayload,
        statusCounts,
        id,
    } = campaign;

    const handleOpenCampaign = () => {
        navigate(`/marketing/campaign-details/${id}`);
    };

    // Function to find the object with the specific status and return its count
    const getStatusCount = (statusCounts, statusName) => {
        const statusObject = statusCounts?.find((item) => item.statusName === statusName);
        return statusObject ? statusObject.count : 0; // Return 0 if the status is not found
    };

    const totalCount = getStatusCount(statusCounts, "Delivered");

    return (
        <Box className={styles.campaignCardContainer}>
            <Box className={styles.campaignCard}>
                <Box className={styles.cardHeader}>
                    <Box className={styles.cardType}>
                        {campaignChannel === "Email" ? (
                            <>
                                <IconButton size="lg" className={`${styles.emailIcon} ${styles.emailIconBg}`}>
                                    <CampaignTypeEmail size="lg" className={styles.mIcon} />
                                </IconButton>
                            </>
                        ) : campaignChannel === "Sms" ? (
                            <>
                                {" "}
                                <IconButton size="lg" className={`${styles.emailIcon} ${styles.emailIconBg}`}>
                                    <CampaignTypeTextMessage size="lg" className={styles.mIcon} />
                                </IconButton>
                            </>
                        ) : null}

                        <Typography className={styles.campaignTitle} variant="h4" onClick={handleOpenCampaign}>
                            {truncateText(customCampaignDescription, isSmallScreen ? 15 : 45)}
                        </Typography>
                    </Box>
                    <ActionPopoverContainer campaign={campaign} />
                </Box>
                <Box className={styles.cardDivider} />
                <Box className={styles.cardDetails}>
                    {campaignChannel && (
                        <Box className={styles.cardLabel}>
                            I want to send {campaignChannel === "Sms" ? "a" : "an"} {campaignChannel.toLowerCase()} to
                            <span className={styles.cardValue}>
                                {customCampaignDescription} to {requestPayload?.leads[0]?.firstName}
                                {requestPayload?.leads[0]?.lastName}
                            </span>
                        </Box>
                    )}
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
                    {statusCounts?.length > 0 && (
                        <Box className={styles.clicksCardsContainer}>
                            <Grid container spacing={1}>
                                {statusCounts.map((item, index) => (
                                    <Grid
                                        item
                                        xs={item.statusName === "clicked" && statusCounts.length === 3 ? 12 : 6}
                                        md={item.statusName === "clicked" && statusCounts.length === 3 ? 12 : 6}
                                        key={index}
                                    >
                                        <CampaignMetricCard
                                            key={index}
                                            statusName={item.statusName}
                                            count={item.count}
                                            showPercentage={item.showPercentage}
                                            icon={item.icon}
                                            campaignChannel={campaignChannel}
                                            leadIds={item.leadIds}
                                            campaignName={customCampaignDescription}
                                            totalCount={totalCount}
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
                })
            ),
        }),
        statusCounts: PropTypes.arrayOf(
            PropTypes.shape({
                count: PropTypes.number,
                statusName: PropTypes.string,
                showPercentage: PropTypes.string,
                icon: PropTypes.elementType,
                leadIds: PropTypes.arrayOf(),
            })
        ),
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
