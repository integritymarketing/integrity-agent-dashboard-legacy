import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import CampaignSubHeader from "./CampaignSubHeader";
import CampaignInnerContainer from "./CampaignInnerContainer";

export const CampaignInvitationContainer = () => {
    return (
        <Box
            sx={{
                backgroundColor: "#F1F1F1",
            }}
        >
            <CampaignSubHeader title={`Invitation To PlanEnroll`} />
            <CampaignInnerContainer title={`Invitation to PlanEnroll Profile Sync`} />
        </Box>
    );
};

CampaignInvitationContainer.propTypes = {
    /** The title to be displayed in the center of the CampaignInvitationContainer */
    title: PropTypes.string.isRequired,
    /** Function to be called when the back button is clicked */
    onBackClick: PropTypes.func.isRequired,
};
