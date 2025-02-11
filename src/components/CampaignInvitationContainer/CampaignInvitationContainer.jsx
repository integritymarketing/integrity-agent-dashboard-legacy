import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import CampaignSubHeader from "./CampaignSubHeader";
import CampaignInnerContainer from "./CampaignInnerContainer";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import WithLoader from "components/ui/WithLoader";
import { useMarketing } from "providers/Marketing";

export const CampaignInvitationContainer = () => {
    const { campaignId } = useParams();
    const {isUpdateCampaignLoading}= useMarketing();
    const { handleGetCampaignDetailsById, isFetchCampaignDetailsByIdLoading } = useCampaignInvitation();

    useEffect(() => {
        if (campaignId) {
            handleGetCampaignDetailsById(campaignId);
        }
    }, [campaignId]);

    return (
        <Box
            sx={{
                backgroundColor: "#F1F1F1",
            }}
        >
            <CampaignSubHeader />
            <WithLoader isLoading={isFetchCampaignDetailsByIdLoading || isUpdateCampaignLoading}>
                <CampaignInnerContainer />
            </WithLoader>
        </Box>
    );
};
