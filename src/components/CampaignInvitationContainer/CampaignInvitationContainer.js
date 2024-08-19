import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import CampaignSubHeader from "./CampaignSubHeader";
import CampaignInnerContainer from "./CampaignInnerContainer";
import { useCampaignInvitation } from "providers/CampaignInvitation";
import WithLoader from "components/ui/WithLoader";

export const CampaignInvitationContainer = () => {
    const { getCampaignDetailsByEmail, isGetCampaignDetailsByEmailLoading } = useCampaignInvitation();

    useEffect(() => {
        getCampaignDetailsByEmail();
    }, []);

    return (
        <WithLoader isLoading={isGetCampaignDetailsByEmailLoading}>
            <Box
                sx={{
                    backgroundColor: "#F1F1F1",
                }}
            >
                <CampaignSubHeader />
                <CampaignInnerContainer />
            </Box>
        </WithLoader>
    );
};

CampaignInvitationContainer.propTypes = {
    /** The title to be displayed in the center of the CampaignInvitationContainer */
    title: PropTypes.string.isRequired,
    /** Function to be called when the back button is clicked */
    onBackClick: PropTypes.func.isRequired,
};
