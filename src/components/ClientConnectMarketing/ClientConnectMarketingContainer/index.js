import { Box } from "@mui/material";
import CampaignSubHeader from "../CampaignSubHeader";
import CampaignsStatusList from "../CampaignsStatusList";
import WithLoader from "components/ui/WithLoader";
import styles from "./styles.module.scss";

export const ClientConnectMarketingContainer = () => {
    return (
        <WithLoader isLoading={false}>
            <Box className={styles.campaignContainer}>
                <CampaignSubHeader />
                <CampaignsStatusList />
            </Box>
        </WithLoader>
    );
};
