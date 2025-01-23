import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useCampaignInvitation } from "providers/CampaignInvitation";

import styles from "./styles.module.scss";

const TextContent = () => {
    const { templateDetails } = useCampaignInvitation();

    return (
        <Grid item md={12} xs={12} className={styles.emailDetails}>
            {templateDetails?.map((detail) => (
                <>
                    <Box className={styles.detailItem} key={detail.sectionOrder}>
                        <Typography className={styles.detailTitle}> {detail.sectionName}</Typography>
                        <Box className={styles.detailContent}>
                            <Typography className={styles.detailText}>{detail.sectionText}</Typography>
                        </Box>
                    </Box>
                </>
            ))}
        </Grid>
    );
};

export default TextContent;
