import React from "react";
import { Box, Typography } from "@mui/material";
import styles from "./styles.module.scss";

export const IulQuoteHeader = ({ title }) => {
    return (
        <Box className={styles.subHeader}>
            <Box className={styles.backToContacts}>
                <Button
                    icon={<img src={NewBackBtn} alt="Back" />}
                    label="Back"
                    onClick={() => {
                        window.history.back();
                    }}
                    type="tertiary"
                    className={styles.backButton}
                />
            </Box>
            <Typography
                sx={{
                    color: "#052A63",
                    fontSize: "32px",
                    textAlign: "center",
                    lineHeight: "40px",
                    flexGrow: 1,
                }}
            >
                Campaign Details
            </Typography>
        </Box>
    );
};
