import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import CampaignSubHeader from "./CampaignSubHeader";
import CampaignInnerContainer from "./CampaignInnerContainer";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import WithLoader from "components/ui/WithLoader";

export const CampaignInvitationContainer = () => {
    const { campaignId } = useParams();

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
            <WithLoader isLoading={isFetchCampaignDetailsByIdLoading}>
                <CampaignInnerContainer />
            </WithLoader>
        </Box>
    );
};
