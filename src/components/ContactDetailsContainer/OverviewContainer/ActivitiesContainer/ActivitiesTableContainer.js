import React from "react";
import Box from "@mui/material/Box";
import useContactDetails from "pages/ContactDetails/useContactDetails";
import { useParams } from "react-router-dom";
import Activities from "pages/ContactDetails/Activities";


export const ActivitiesTableContainer = () => {

    const { leadId } = useParams();
    const { getLeadDetails } = useContactDetails(leadId);

    return (
        <Box>
            <Activities getLeadDetails={getLeadDetails} />
        </Box>
    );
};

