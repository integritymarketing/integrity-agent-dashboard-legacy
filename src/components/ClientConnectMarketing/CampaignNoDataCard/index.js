import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import styles from "./styles.module.scss";

const CampaignNoDataCard = ({ message }) => (
    <Box className={styles.messageBox}>
        <Typography variant="body1" className={styles.message}>
            {message}
        </Typography>
    </Box>
);

CampaignNoDataCard.propTypes = {
    message: PropTypes.string.isRequired,
};

export default CampaignNoDataCard;
