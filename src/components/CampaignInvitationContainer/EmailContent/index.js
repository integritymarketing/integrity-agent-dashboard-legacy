import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import styles from "./styles.module.scss";
import { useCampaignInvitation } from "providers/CampaignInvitation";

const EmailContent = () => {
    const { templateDetails } = useCampaignInvitation();

    return (
        <Grid item md={6} xs={12} direction={"column"} className={styles.emailDetails}>
            {templateDetails?.map((detail) => (
                <>
                    <Box className={styles.detailItem} key={detail.sectionOrder}>
                        <Typography className={styles.detailTitle}>{detail.sectionName}</Typography>
                        <Box className={styles.detailContent}>
                            <Typography className={styles.detailText}>{detail.sectionText}</Typography>
                        </Box>
                    </Box>
                </>
            ))}
        </Grid>
    );
};

export default EmailContent;
