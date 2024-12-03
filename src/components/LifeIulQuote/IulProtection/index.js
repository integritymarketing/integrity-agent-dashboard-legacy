import { useCallback, useEffect, useMemo, useState } from "react";
import { IulQuoteContainer, IulQuoteCard, IulProtectionQuoteFilter } from "../CommonComponents";
import { Grid, Typography, Box, Tab, Tabs, useTheme, useMediaQuery } from "@mui/material";
import { useLifeIulQuote } from "providers/Life";
import WithLoader from "components/ui/WithLoader";
import styles from "./styles.module.scss";

const IulProtectionQuote = () => {
    const {
        fetchLifeIulQuoteResults,
        isLoadingLifeIulQuote,
        lifeIulQuoteResults,
        handleTabSelection,
        tabSelected,
        setTabSelected,
        showFilters,
    } = useLifeIulQuote();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [isTobaccoUser, setIsTobaccoUser] = useState(false);

    const getQuoteResults = useCallback(async () => {
        const lifeQuoteProtectionDetails = sessionStorage.getItem("lifeQuoteProtectionDetails");

        if (lifeQuoteProtectionDetails) {
            const parsedLifeQuoteProtectionDetails = JSON.parse(lifeQuoteProtectionDetails);

            setIsTobaccoUser(parsedLifeQuoteProtectionDetails.isTobaccoUser);
            setTabSelected(null);
            const { birthDate, gender, state, healthClasses, faceAmounts, payPeriods, illustratedRate, solves } =
                parsedLifeQuoteProtectionDetails;

            const payload = {
                inputs: [
                    {
                        birthDate: birthDate,
                        gender: gender,
                        healthClasses: [healthClasses],
                        state: state,
                        faceAmounts: faceAmounts,
                        payPeriods: [payPeriods],
                        solves: [solves],
                        props: {
                            illustratedRate: illustratedRate,
                        },
                    },
                ],
                quoteType: "IULPROT-SOLVE",
            };

            await fetchLifeIulQuoteResults(payload);
        }
    }, [fetchLifeIulQuoteResults]);

    useEffect(() => {
        getQuoteResults();
    }, []);

    const tabInputs = useMemo(() => {
        const lifeQuoteProtectionDetails = sessionStorage.getItem("lifeQuoteProtectionDetails");
        const parsedLifeQuoteProtectionDetails = JSON.parse(lifeQuoteProtectionDetails);
        const faceAmounts = parsedLifeQuoteProtectionDetails?.faceAmounts;
        return faceAmounts;
    }, [sessionStorage.getItem("lifeQuoteProtectionDetails")]);

    const selectedTabIndex = tabInputs.findIndex((tab) => tab === tabSelected);

    return (
        <IulQuoteContainer title="IUL Protection">
            <Grid item md={3} xs={12}>
                {isMobile && showFilters && (
                    <Box className={styles.countSortContainer}>
                        <Typography variant="body1" className={styles.countSortText}>
                            {lifeIulQuoteResults?.length} IUL Accumulation Policies
                        </Typography>
                    </Box>
                )}
                <IulProtectionQuoteFilter />
            </Grid>
            {!showFilters && (
                <Grid item md={8} xs={12}>
                    <Box className={styles.countSortContainer}>
                        {!isMobile && (
                            <Box className={styles.countSortContainer}>
                                <Typography variant="body1" className={styles.countSortText}>
                                    {lifeIulQuoteResults?.length} IUL Protection Policies
                                </Typography>
                            </Box>
                        )}
                        <Box width={isMobile ? "100%" : "60%"}>
                            {tabInputs.length > 1 && lifeIulQuoteResults?.length > 0 && (
                                <Tabs
                                    value={parseInt(selectedTabIndex) !== -1 ? parseInt(selectedTabIndex) : false}
                                    aria-label="communications-tabs"
                                    variant="fullWidth"
                                    className={styles.tabs}
                                >
                                    {tabInputs.map((faceAmount, index) => (
                                        <Tab
                                            key={`faceAmount-${index}`}
                                            active={tabSelected === faceAmount}
                                            activeColor="primary"
                                            label={`$${faceAmount}`}
                                            onClick={() => handleTabSelection(faceAmount)}
                                        />
                                    ))}
                                </Tabs>
                            )}
                        </Box>
                    </Box>
                    <WithLoader isLoading={isLoadingLifeIulQuote}>
                        <Grid container gap={3}>
                            {lifeIulQuoteResults?.map((plan, index) => {
                                const {
                                    productName,
                                    companyName,
                                    amBest,
                                    companyLogoImageUrl,
                                    cashValueYear10,
                                    cashValueYear20,
                                    cashValueAge65,
                                    maxIllustratedRate,
                                    indexStrategyType,
                                    distribution,
                                    deathBenefit,
                                    targetPremium,
                                    premium,
                                } = plan;
                                return (
                                    <Grid item md={12} key={`iul-accumulation-${index}`}>
                                        <IulQuoteCard
                                            quoteType="IUL Protection"
                                            cardTitle={productName}
                                            companyName={companyName}
                                            rating={amBest}
                                            logo={companyLogoImageUrl}
                                            cashValueYear10={cashValueYear10}
                                            cashValueYear20={cashValueYear20}
                                            cashValueAge65={cashValueAge65}
                                            maxIllustratedRate={maxIllustratedRate}
                                            indexStrategyType={indexStrategyType}
                                            isTobaccoUser={isTobaccoUser}
                                            targetPremium={targetPremium}
                                            deathBenefit={deathBenefit}
                                            distribution={distribution}
                                            age={plan?.input?.actualAge}
                                            healthClass={plan?.input?.healthClass}
                                            premium={premium}
                                        />
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

export default IulProtectionQuote;
