import React from "react";
import { Box } from "@mui/material";
import styles from "./styles.module.scss";

const NoCampaignListCard = () => {
    return <Box className={styles.noCampaignsCard}>There are no completed campaigns to show.</Box>;
};

export default NoCampaignListCard;
