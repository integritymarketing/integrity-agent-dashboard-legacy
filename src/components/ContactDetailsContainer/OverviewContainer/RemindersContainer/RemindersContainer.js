import React from "react";

import Box from "@mui/material/Box";

import { RemindersList } from "./RemindersList/RemindersList";

export const RemindersContainer = ({ isMobile }) => {
    return (
        <Box>
            <RemindersList isMobile={isMobile} />
        </Box>
    );
};
