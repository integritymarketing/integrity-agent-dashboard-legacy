import PropTypes from "prop-types";
import { Box, Grid } from "@mui/material";
import CampaignStatusCard from "../CampaignStatusCard";
import styles from "./styles.module.scss";
import Scroller from "../Carousel";

const CampaignsList = ({ campaigns }) => {
    const cardRenderer = (campaign) => <CampaignStatusCard campaign={campaign} />;

    return (
        <Box className={styles.campaignsList}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Scroller cards={campaigns} cardRenderer={cardRenderer} />
                </Grid>
            </Grid>
        </Box>
    );
};

CampaignsList.propTypes = {
    title: PropTypes.string.isRequired,
    campaigns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            sentDate: PropTypes.string,
            trigger: PropTypes.string,
            stats: PropTypes.shape({
                recipients: PropTypes.number,
                opens: PropTypes.number,
                clicks: PropTypes.number,
                unsubscribes: PropTypes.number,
            }),
        }),
    ).isRequired,
};

export default CampaignsList;
