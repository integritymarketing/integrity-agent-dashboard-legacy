import { Box } from "@mui/material";
import CampaignNoDataCard from "../CampaignNoDataCard";
import styles from "./styles.module.scss";

const CampaignsStatusList = () => {
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
            <CampaignNoDataCard data={campaignsNoListData["drafts"]} />
            <CampaignNoDataCard data={campaignsNoListData["active"]} />
            <CampaignNoDataCard data={campaignsNoListData["paused"]} />
            <CampaignNoDataCard data={campaignsNoListData["completed"]} />
        </Box>
    );
};

export default CampaignsStatusList;
