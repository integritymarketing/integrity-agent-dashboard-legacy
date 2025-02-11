import React from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import Activities from "pages/ContactDetails/Activities";

export const ActivitiesTableContainer = () => {
    const { leadId } = useParams();

    return (
        <Box>
            <Activities leadId={leadId} />
        </Box>
    );
};
