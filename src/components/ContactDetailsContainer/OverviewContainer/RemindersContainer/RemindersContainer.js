import React from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { useLeadDetails } from "providers/ContactDetails";
import { RemindersList } from "./RemindersList/RemindersList";


export const RemindersContainer = () => {


    return (
        <Box>

            <RemindersList />

        </Box>
    );
};
