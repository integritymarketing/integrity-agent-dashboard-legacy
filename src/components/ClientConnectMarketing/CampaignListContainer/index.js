import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import CampaignsList from "../CampaignsList";
import CampaignNoDataCard from "../CampaignNoDataCard";
import { filterCampaignsByStatus } from "utils/shared-utils/sharedUtility";
import useHover from "hooks/useHover";
import styles from "./styles.module.scss";

const CampaignListContainer = ({ data, campaigns, status }) => {
    const { isHovered, handleMouseEnter, handleMouseLeave } = useHover();
    const campaigns_List = useMemo(() => filterCampaignsByStatus(campaigns, status), [campaigns, status]);

    return (
        <Box className={styles.campaignListContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Typography variant="h2" className={styles.title}>
                {data.title}
            </Typography>
            <Typography variant="body1" className={styles.body}>
                {data.body}
            </Typography>
            {campaigns_List?.length > 0 ? (
                <CampaignsList campaigns={campaigns_List} isHovered={isHovered} />
            ) : (
                <CampaignNoDataCard message={data?.message} />
            )}
        </Box>
    );
};

CampaignListContainer.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        message: PropTypes.string,
    }).isRequired,
    campaigns: PropTypes.arrayOf(PropTypes.object).isRequired,
    status: PropTypes.string.isRequired,
};

export default CampaignListContainer;
