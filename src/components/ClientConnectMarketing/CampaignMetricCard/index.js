import PropTypes from "prop-types";
import { Box, Typography, IconButton } from "@mui/material";
import styles from "./styles.module.scss";
import "../../../../src/index.scss";

const CampaignMetricCard = ({ icon: IconComponent, name, value, sPercentage }) => (
    <Box className={styles.statusInfo}>
        <Box className={styles.icons}>
            <IconButton size="lg" className={`${styles.integrityIcon} ${styles.integrityIconBg}`}>
                <IconComponent className={styles.iconComponent} />
            </IconButton>
        </Box>
        <Box textAlign="left" className={styles.metricData}>
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
