import React from "react";
import { Typography, Box, Button } from "@mui/material";
import styles from "./styles.module.scss";
import PlusIcon from "images/Campaigns/icons-Plus.svg";

const CampaignSubHeader = () => {
    return (
        <Box className={styles.campaignSubHeader}>
            <Box className={styles.campaignHeader}>
                <Typography variant="h2">Client Connect Marketing</Typography>
            </Box>

            <Box className={styles.newCampaignButton}>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    endIcon={<img src={PlusIcon} alt="Plus Icon" />}
                >
                    New Campaign
                </Button>
            </Box>
        </Box>
    );
};

export default CampaignSubHeader;
