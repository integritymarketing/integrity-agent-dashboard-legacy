import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import styles from "./styles.module.scss";

const EmailContent = () => {
    return (
        <Grid item md={6} xs={12} className={styles.emailDetails}>
            <Box className={styles.detailItem}>
                <Typography className={styles.detailTitle}>Subject</Typography>
                <Box className={styles.detailContent}>
                    <Typography className={styles.detailText}>
                        Cras mattis consectetur purus sit amet fermentum.
                    </Typography>
                </Box>
            </Box>
            <Box className={styles.detailItem}>
                <Typography className={styles.detailTitle}>Preview Text</Typography>
                <Box className={styles.detailContent}>
                    <Typography className={styles.detailText}>
                        Vestibulum id ligula porta felis euismod semper. Donec id elit non mi porta gravida at eget
                        metus.
                    </Typography>
                </Box>
            </Box>
            <Box className={styles.detailItem}>
                <Typography className={styles.detailTitle}>Body Text</Typography>
                <Box className={styles.detailContent}>
                    <Typography className={styles.detailText}>
                        Donec sed odio dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est
                        non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Vestibulum id
                        ligula porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur. Morbi leo
                        risus, porta ac consectetur ac, vestibulum at eros. Curabitur blandit tempus porttitor.
                    </Typography>
                </Box>
            </Box>
        </Grid>
    );
};

export default EmailContent;
