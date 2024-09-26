import PropTypes from "prop-types";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const statusMapping = {
    open: "Opened",
    UnSubscribed: "Unsubscribed",
    click: "Clicked",
};

const formatStatusName = (statusName) => {
    return statusMapping[statusName] || statusName;
};

const CampaignMetricCard = ({
    icon: IconComponent,
    statusName,
    count,
    showPercentage,
    campaignChannel,
    leadIds,
    campaignName,
    totalCount,
}) => {
    const navigate = useNavigate();
    const handleJumpList = () => {
        if (count === 0) {
            return;
        }
        localStorage.setItem("campaignsLeadIds", JSON.stringify(leadIds));
        localStorage.setItem(
            "campaignsLeadInfo",
            JSON.stringify({ status: statusName, campaignName: campaignName, totalCount: totalCount }),
        );
        navigate("/contacts/list");
    };

    return (
        <Box className={`${styles.statusInfo} ${count === 0 ? styles.disable : ""}`} onClick={handleJumpList}>
            <Box className={styles.icons}>
                <IconButton size="lg" className={`${styles.integrityIcon} ${styles.integrityIconBg}`}>
                    <IconComponent className={styles.iconComponent} />
                </IconButton>
            </Box>
            <Box textAlign="left" className={styles.metricData}>
                <Typography variant="h5" className={styles.statusName}>
                    {formatStatusName(statusName)}
                </Typography>
                <Box className={styles.percentage}>
                    <span className={styles.statusPercentageNumber}>{campaignChannel === "Email" ? count : "N/A"}</span>
                    &nbsp;
                    <span className={styles.statusInfoPercentage}>
                        {campaignChannel === "Email" ? showPercentage : ""}
                    </span>
                </Box>
            </Box>
        </Box>
    );
};

CampaignMetricCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    statusName: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    showPercentage: PropTypes.string,
    campaignChannel: PropTypes.string.isRequired,
    leadIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    campaignName: PropTypes.string.isRequired,
    totalCount: PropTypes.number.isRequired,
};

CampaignMetricCard.defaultProps = {
    showPercentage: "",
};

export default CampaignMetricCard;
