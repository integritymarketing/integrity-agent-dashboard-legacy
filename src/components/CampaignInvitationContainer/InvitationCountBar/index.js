import React from "react";
import { Box } from "@mui/material";
import styles from "./styles.module.scss";

const InvitationCountBar = () => {
    return (
        <Box className={styles.banner}>
            <Box className={styles.colorBar}></Box>
            <Box className={styles.bannerContent}>
                Sending to <span className={styles.count}>1308</span> of <span className={styles.count}>1308</span>{" "}
                contacts
            </Box>
            <Box
                sx={{
                    border: "1px solid #CCCCCC",
                    height: "30px",
                }}
            />

            <Box
                sx={{
                    color: "#052A63",
                    fontSize: "16px",
                    fontWeight: "600",
                    lineHeight: "20px",
                    marginLeft: "20px",
                }}
            >
                All Contacts
            </Box>
        </Box>
    );
};

export default InvitationCountBar;
