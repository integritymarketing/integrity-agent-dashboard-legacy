import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, useMediaQuery, useTheme, IconButton } from "@mui/material";
import EmailIcon from "components/icons/Marketing/emailIcon";
import CampaignStatusInfoCard from "../CampaignStatusInfoCard";
import CampaignMetricCard from "../CampaignMetricCard";
import truncateText from "utils/truncateText";
import styles from "./styles.module.scss";
import ActionPopoverContainer from "../ActionPopover";

import {
    CampaignTypeTextMessage,
    CampaignTypeEmail,
    MetricRecipients,
    MetricOpens,
    MetricClicks,
    MetricUnsubscribes,
} from "@integritymarketing/icons";
import { useMarketing } from "providers/Marketing";

import { useMemo } from "react";

const staticData = [
    { count: 0, showPercentage: 0, statusName: "Delivered", leadIds: [], icon: MetricRecipients },
    { count: 0, showPercentage: 0, statusName: "open", leadIds: [], icon: MetricOpens },
    { count: 0, showPercentage: 0, statusName: "click", leadIds: [], icon: MetricClicks },
    {
        count: 0,
        showPercentage: 0,
        statusName: "UnSubscribed",
        leadIds: [],
        icon: MetricUnsubscribes,
    },
];

const CampaignStatusCard = ({ campaign }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const { smsData, emailData } = useMarketing();

    const {
        campaignChannel,
        customCampaignDescription,
        campaignStatus,
        campaignType,
        runDate,
        createdDate,
        modifiedDate,
        requestPayload,
        statusCounts,
        id,
        campaignId,
        campaignSelectedAction,
        customFilter,
    } = campaign;

    const showCampaignInfo = () => {
        if (campaignChannel === "Email" && emailData?.length > 0) {
            const campaignData = emailData.find((item) => item.id === campaignId);
            return campaignData ? campaignData?.campaignDescription : "...";
        } else if (campaignChannel === "Sms" && smsData?.length > 0) {
            const campaignData = smsData.find((item) => item.id === campaignId);
            return campaignData ? campaignData?.campaignDescription : "...";
        }
        return "...";
    };

    const showActionInfo = () => {
        if (showCampaignInfo() === "...") return "";
        if (campaignSelectedAction === "a contact" && requestPayload?.leads?.length > 0) {
            return ` to ${requestPayload?.leads[0]?.firstName} ${requestPayload?.leads[0]?.lastName}.`;
        } else if (campaignSelectedAction === "contacts filtered by…") {
            return " to Filtered contacts.";
        } else if (campaignSelectedAction === "a contact when") {
            return " a contact when a tag is added.";
        } else if (campaignSelectedAction !== "") {
            return ` to ${campaignSelectedAction}.`;
        } else {
            return " ...";
        }
    };

    const calPercentage = (list, totalCount) => {
        if (!list || list.statusName === "Delivered") {
            return null;
        } else if (["open", "click", "UnSubscribed"].includes(list.statusName)) {
            const per = totalCount === 0 ? 0 : (list.count / totalCount) * 100;
            return `${Math.round(per)}%`;
        }

        return "0";
    };

    const mergeData = (staticData, apiData) => {
        if (!apiData?.length) {
            return staticData;
        }
        const order = ["Delivered", "open", "click", "UnSubscribed"];
        const icons = [MetricRecipients, MetricOpens, MetricClicks, MetricUnsubscribes];

        const totalCount = apiData?.find((item) => item.statusName === "Delivered")?.count || 0;

        const mergedData = staticData.map((item) => {
            const data = apiData?.find((status) => status.statusName === item.statusName);
            if (campaign.campaignChannel === "Email") {
                return {
                    ...item,
                    count: data?.count,
                    showPercentage: calPercentage(data, totalCount),
                    icon: icons[order.indexOf(item.statusName)],
                    leadIds: data?.leadIds || [],
                    totalCount: totalCount || 0,
                };
            } else {
                return {
                    ...item,
                };
            }
        });

        const removeUnSubscribed = mergedData.filter(
            (item) => !(item.statusName === "UnSubscribed" && item.count === null)
        );
        return removeUnSubscribed;
    };

    const statusData = useMemo(() => mergeData(staticData, statusCounts), [statusCounts]);

    const handleOpenCampaign = () => {
        navigate(`/marketing/campaign-details/${id}`);
    };

    const convertCampaignChannel = () => {
        const lowerCaseChannel = campaignChannel.toLowerCase();
        if (lowerCaseChannel === "sms") {
            return "text";
        }
        return campaignChannel.toLowerCase();
    };

    return (
        <Box className={styles.campaignCardContainer}>
            <Box className={styles.campaignCard}>
                <Box className={styles.cardHeader}>
                    <Box className={styles.cardType}>
                        {campaignChannel === "Email" ? (
                            <IconButton size="lg" className={`${styles.emailIcon} ${styles.emailIconBg}`}>
                                <CampaignTypeEmail size="lg" className={styles.mIcon} />
                            </IconButton>
                        ) : campaignChannel === "Sms" ? (
                            <IconButton size="lg" className={`${styles.emailIcon} ${styles.emailIconBg}`}>
                                <CampaignTypeTextMessage size="lg" className={styles.mIcon} />
                            </IconButton>
                        ) : null}

                        <Typography className={styles.campaignTitle} variant="h4" onClick={handleOpenCampaign}>
                            {truncateText(customCampaignDescription, isSmallScreen ? 15 : 45)}
                        </Typography>
                    </Box>
                    <ActionPopoverContainer
                        campaign={campaign}
                        advanceMode={campaignSelectedAction === "a contact when"}
                        campaignDescription={showCampaignInfo()}
                    />
                </Box>
                <Box className={styles.cardDivider} />
                <Box className={styles.cardDetails}>
                    {campaignChannel && (
                        <Box className={styles.cardLabel}>
                            I want to send {campaignChannel === "Sms" ? "a" : "an"} {convertCampaignChannel()}
                            <span className={styles.cardValue}>{showCampaignInfo()}</span>
                            {showActionInfo()}
                        </Box>
                    )}
                </Box>
            </Box>
            {campaignStatus !== "Draft" && (
                <Box sx={{ padding: "16px" }}>
                    <Box className={styles.statusCard}>
                        <CampaignStatusInfoCard
                            runDate={runDate}
                            createdDate={createdDate}
                            modifiedDate={modifiedDate}
                            campaignStatus={campaignStatus}
                            campaignType={campaignType}
                            customFilter={customFilter}
                        />
                    </Box>
                    {statusData?.length > 0 && (
                        <Box className={styles.clicksCardsContainer}>
                            <Grid container spacing={1}>
                                {statusData.map((item, index) => (
                                    <Grid
                                        item
                                        xs={item.statusName === "click" && statusData.length === 3 ? 12 : 6}
                                        md={item.statusName === "click" && statusData.length === 3 ? 12 : 6}
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
                                            totalCount={item.totalCount}
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
        campaignRunDate: PropTypes.string,
        customCampaignDescription: PropTypes.string.isRequired,
        runDate: PropTypes.string,
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
                leadIds: PropTypes.arrayOf(PropTypes.string),
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
        id: PropTypes.string.isRequired,
        campaignId: PropTypes.number,
        campaignSelectedAction: PropTypes.string,
    }).isRequired,
};

export default CampaignStatusCard;
