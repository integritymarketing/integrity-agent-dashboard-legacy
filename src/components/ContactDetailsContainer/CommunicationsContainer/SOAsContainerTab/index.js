import { useState } from "react";
import { Container, Tabs, Tab, Grid, Box } from "@mui/material";
import { ScopeOfAppointmentContainer } from "components/ContactDetailsContainer/ScopeOfAppointmentContainer";

const SOAsContainerTab = () => {
    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <ScopeOfAppointmentContainer isSOATab={true} />
        </Box>
    );
};

export default SOAsContainerTab;
