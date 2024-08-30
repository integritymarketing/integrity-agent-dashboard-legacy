import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import styles from "./styles.module.scss";

const CampaignNoDataCard = ({ data }) => {
    return (
        <Box className={styles.noListCard}>
            <Typography variant="h2" className={styles.title}>
                {data.title}
            </Typography>
            <Typography variant="body1" className={styles.body}>
                {data.body}
            </Typography>
            <Box className={styles.messageBox}>
                <Typography variant="body1" className={styles.message}>
                    {data.message}
                </Typography>
            </Box>
        </Box>
    );
};

CampaignNoDataCard.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
    }).isRequired,
};

export default CampaignNoDataCard;
