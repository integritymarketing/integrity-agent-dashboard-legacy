import PropTypes from "prop-types";
import { Box } from "@mui/material";
import CampaignListContainer from "../CampaignListContainer";
import styles from "./styles.module.scss";

const CampaignsStatusList = ({ allCampaignsList }) => {
    const campaignsNoListData = {
        drafts: {
            title: "Drafts",
            body: "Client Marketing Campaigns that are not running yet.",
            message: "There are no draft campaigns to show.",
        },
        active: {
            title: "Active",
            body: "Client Marketing Campaigns that are currently running.",
            message: "There are no active campaigns to show.",
        },
        paused: {
            title: "Paused",
            body: "Client Marketing Campaigns that have been paused.",
            message: "There are no paused campaigns to show.",
        },
        completed: {
            title: "Completed",
            body: "Client Marketing Campaigns that have finished running.",
            message: "There are no completed campaigns to show.",
        },
    };

    return (
        <Box className={styles.campaignInnerContainer}>
            <CampaignListContainer data={campaignsNoListData["drafts"]} campaigns={allCampaignsList} status="Draft" />{" "}
            <CampaignListContainer data={campaignsNoListData["active"]} campaigns={allCampaignsList} status="Active" />
            <CampaignListContainer data={campaignsNoListData["paused"]} campaigns={allCampaignsList} status="Paused" />
            <CampaignListContainer
                data={campaignsNoListData["completed"]}
                campaigns={allCampaignsList}
                status="Completed"
            />
        </Box>
    );
};

CampaignsStatusList.propTypes = {
    allCampaignsList: PropTypes.arrayOf(
        PropTypes.shape({
            campaignStatus: PropTypes.string.isRequired,
            campaignRunDate: PropTypes.string,
        }),
    ).isRequired,
};

export default CampaignsStatusList;
