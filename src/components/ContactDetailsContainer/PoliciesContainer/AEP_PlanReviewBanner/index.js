import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import { Typography, Button, Grid } from "@mui/material";
import ArrowForwardWithCircle from "components/icons/version-2/ArrowForwardWithCircle";
import { useLeadDetails } from "providers/ContactDetails";
import { useNavigate } from "react-router-dom";
import { isHaveCarrierId } from "utils/shared-utils/sharedUtility";
import styles from "./styles.module.scss";

const AEP_PlanReviewBanner = () => {
    const { leadId } = useParams();
    const { leadDetails } = useLeadDetails();
    const navigate = useNavigate();

    const isLeadHasAskIntegrityShoppersTags = leadDetails?.leadTags?.find((item) =>
        item?.tag?.tagLabel?.toLowerCase()?.includes("shopper priority")
    );

    const url = isLeadHasAskIntegrityShoppersTags?.interactionUrl;

    const handleCarrierClick = () => {
        const decodedURI = decodeURIComponent(url);
        const [, queryString] = decodedURI.split("?");

        navigate(`/plans/${leadId}?${queryString}`);
    };

    const showButton = isHaveCarrierId(url);

    return (
        <>
            {isLeadHasAskIntegrityShoppersTags && (
                <Box className={styles.aepPlanReviewBannerContainer}>
                    <Grid container className={styles.aepPlanReviewBanner}>
                        <Grid item md={showButton ? 8 : 12}>
                            <Typography variant="h4" color="#052A63">
                                AEP Plan Review
                            </Typography>
                            <Typography variant="body1" color="#434A51">
                                Many Medicare plans are changing this year. Current carrier may offer alternatives for
                                existing members. Make sure to complete an AEP plan review with your client
                            </Typography>
                        </Grid>
                        {showButton && (
                            <Grid item md={4} className={styles.buttonContainer}>
                                <Button
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                    endIcon={<ArrowForwardWithCircle />}
                                    onClick={handleCarrierClick}
                                >
                                    Current Carrier Plans
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}
        </>
    );
};

export default AEP_PlanReviewBanner;
