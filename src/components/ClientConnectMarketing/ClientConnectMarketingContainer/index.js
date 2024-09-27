import { useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import CampaignSubHeader from "../CampaignSubHeader";
import CampaignsStatusList from "../CampaignsStatusList";
import WithLoader from "components/ui/WithLoader";
import { useMarketing } from "providers/Marketing";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import styles from "./styles.module.scss";

export const ClientConnectMarketingContainer = () => {
    const { getCompletedCampaigns, isFetchCompletedCampaignsLoading, allCampaignsList, setEmailData, setSmsData } = useMarketing();
    const  {getCampaignDetailsByEmail, getCampaignDetailsByText} = useCampaignInvitation();

 

    const handleCampaignDetails = useCallback(async() => {
       const emailData = await getCampaignDetailsByEmail();
       const smsData = await getCampaignDetailsByText();
          setEmailData(emailData);
            setSmsData(smsData);
    }, [getCampaignDetailsByEmail, getCampaignDetailsByText]);

    useEffect(() => {
        handleCampaignDetails();

        getCompletedCampaigns();

    }, [getCompletedCampaigns]);

    return (
        <WithLoader isLoading={isFetchCompletedCampaignsLoading}>
            <Box className={styles.campaignContainer}>
                <CampaignSubHeader />
                <CampaignsStatusList allCampaignsList={allCampaignsList} />
            </Box>
        </WithLoader>
    );
};
