import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import styles from "./styles.module.scss";

const CampaignMetricCard = ({ icon: IconComponent, name, value, sPercentage }) => (
    <Box className={styles.statusInfo}>
        <Box className={styles.icons}>
            <IconComponent className={styles.iconComponent} />
        </Box>
        <Box textAlign="left" ml={1}>
            <Typography variant="h5" className={styles.statusName}>
                {name}
            </Typography>
            <Box className={styles.percentage}>
                <span className={styles.statusPercentageNumber}>{value}</span>&nbsp;
                <span className={styles.statusInfoPercentage}>{sPercentage}</span>
            </Box>
        </Box>
    </Box>
);

CampaignMetricCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    sPercentage: PropTypes.string.isRequired,
};

export default CampaignMetricCard;
