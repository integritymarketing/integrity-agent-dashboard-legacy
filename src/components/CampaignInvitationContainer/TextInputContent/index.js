import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import styles from "./styles.module.scss";

const EmailContent = () => {
    return (
        <Grid item md={12} xs={12} className={styles.emailDetails}>
            <Box className={styles.detailItem}>
                <Typography className={styles.detailTitle}>Text Message</Typography>
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
