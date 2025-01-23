import React from "react";
import { Typography, Box } from "@mui/material";
import { Button } from "components/ui/Button";
import NewBackBtn from "images/new-back-btn.svg";
import styles from "./styles.module.scss";

const CampaignSubHeader = () => {
    return (
        <Box
            sx={{
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "1px solid #CCCCCC",
                backgroundColor: "#FFFFFF",
                position: "relative",
            }}
        >
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

export default CampaignSubHeader;
