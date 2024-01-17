import React from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import Activities from "pages/ContactDetails/Activities";
import useContactDetails from "pages/ContactDetails/useContactDetails";

export const ActivitiesTableContainer = () => {
    const { leadId } = useParams();
    const { getLeadDetails } = useContactDetails(leadId);

    return (
        <Box>
            <Activities getLeadDetails={getLeadDetails} leadId={leadId} />
        </Box>
    );
};
