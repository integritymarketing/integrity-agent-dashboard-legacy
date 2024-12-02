import React, { useCallback, useEffect, useState } from "react";
import { IulQuoteContainer } from "../CommonComponents";
import { Grid, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { useLifeIulQuote } from "providers/Life";
import styles from "./styles.module.scss";
import WithLoader from "components/ui/WithLoader";

const IulAccumulationQuote = () => {
    const { fetchLifeIulQuoteResults, isLoadingLifeIulQuote, lifeIulQuoteResults, showFilters } = useLifeIulQuote();
    const [isTobaccoUser, setIsTobaccoUser] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const getQuoteResults = useCallback(async () => {
        const lifeQuoteAccumulationDetails = sessionStorage.getItem("lifeQuoteAccumulationDetails");

        if (lifeQuoteAccumulationDetails) {
            const parsedLifeQuoteAccumulationDetails = JSON.parse(lifeQuoteAccumulationDetails);
            setIsTobaccoUser(parsedLifeQuoteAccumulationDetails.isTobaccoUser);

            const { birthDate, gender, state, healthClasses, faceAmounts, payPeriods, illustratedRate, loanType } =
                parsedLifeQuoteAccumulationDetails;

            const payload = {
                inputs: [
                    {
                        birthDate: birthDate,
                        gender: gender,
                        healthClasses: [healthClasses],
                        state: state,
                        faceAmounts: [String(faceAmounts)],
                        payPeriods: [payPeriods],
                        props: {
                            illustratedRate: illustratedRate,
                            loanType: loanType,
                        },
                    },
                ],
                quoteType: "IULACCU-SOLVE",
            };
            await fetchLifeIulQuoteResults(payload);
        }
    }, [fetchLifeIulQuoteResults]);

    useEffect(() => {
        getQuoteResults();
    }, []);

    return (
        <IulQuoteContainer title="IUL Accumulation">
            <Grid item md={3} xs={12}>
                {isMobile && showFilters && (
                    <Box className={styles.countSortContainer}>
                        <Typography variant="body1" className={styles.countSortText}>
                            {lifeIulQuoteResults?.length} IUL Accumulation Policies
                        </Typography>
                    </Box>
                )}
                {/* FILTER COMPONENT */}
            </Grid>
            {!showFilters && (
                <Grid item md={8} spacing={2}>
                    {!isMobile && (
                        <Box className={styles.countSortContainer}>
                            <Typography variant="body1" className={styles.countSortText}>
                                {lifeIulQuoteResults?.length} IUL Accumulation Policies
                            </Typography>
                        </Box>
                    )}
                    <WithLoader isLoading={isLoadingLifeIulQuote}>
                        <Grid container gap={3}>
                            {lifeIulQuoteResults?.map((plan, index) => {
                                return (
                                    <Grid item md={12} key={`iul-accumulation-${index}`}>
                                        {/* CARD COMPONENT  */}
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </WithLoader>
                </Grid>
            )}
        </IulQuoteContainer>
    );
};

export default IulAccumulationQuote;
