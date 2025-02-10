import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const ShareInputsValidator = ({ title = "" }) => {
    return (
        <Box>
            <Typography variant="body1" color="#434A51" marginBottom={2}>
                {title}
            </Typography>
            <Box></Box>
        </Box>
    );
};

export default ShareInputsValidator;
