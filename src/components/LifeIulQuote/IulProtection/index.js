import { useCallback, useEffect, useMemo, useState } from "react";
import { IulQuoteContainer, IulProtectionQuoteFilter } from "../CommonComponents";
import { IulQuoteCard } from "@integritymarketing/clients-ui-kit";
import { Grid, Typography, Box, Tab, Tabs, useTheme, useMediaQuery } from "@mui/material";
import { useLifeIulQuote } from "providers/Life";
import WithLoader from "components/ui/WithLoader";
import styles from "./styles.module.scss";
import { useParams, useNavigate } from "react-router-dom";

const IulProtectionQuote = () => {
    const {
        fetchLifeIulQuoteResults,
        isLoadingLifeIulQuote,
        lifeIulQuoteResults,
        handleTabSelection,
        tabSelected,
        setTabSelected,
        showFilters,
        tempUserDetails,
        handleComparePlanSelect,
        selectedPlans,
    } = useLifeIulQuote();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { contactId } = useParams();
    const navigate = useNavigate();
    const [isTobaccoUser, setIsTobaccoUser] = useState(false);

    const getQuoteResults = useCallback(async () => {
        const lifeQuoteProtectionDetails = sessionStorage.getItem("lifeQuoteProtectionDetails");

        if (lifeQuoteProtectionDetails) {
            const parsedLifeQuoteProtectionDetails = JSON.parse(lifeQuoteProtectionDetails);

            setIsTobaccoUser(parsedLifeQuoteProtectionDetails.isTobaccoUser);
            setTabSelected(null);
            const { birthDate, gender, state, healthClasses, faceAmounts, payPeriods, illustratedRate, solves } =
                parsedLifeQuoteProtectionDetails;
            const filteredFaceAmounts = faceAmounts.filter((amount) => Boolean(amount));
            const payload = {
                inputs: [
                    {
                        birthDate: birthDate,
                        gender: gender,
                        healthClasses: [healthClasses],
                        state: state,
                        faceAmounts: filteredFaceAmounts,
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

    const handlePlanDetailsClick = (id) => {
        navigate(`/life/iul-protection/${id}/${contactId}/quote-details`);
    };

    const tabInputs = useMemo(() => {
        const lifeQuoteProtectionDetails = sessionStorage.getItem("lifeQuoteProtectionDetails");
        const parsedLifeQuoteProtectionDetails = JSON.parse(lifeQuoteProtectionDetails);
        const faceAmounts = parsedLifeQuoteProtectionDetails?.faceAmounts;
        return faceAmounts;
    }, [sessionStorage.getItem("lifeQuoteProtectionDetails")]);

    const filteredTabInputs = tabInputs.filter((tab) => Boolean(tab));
    const selectedTabIndex = filteredTabInputs.findIndex((tab) => tab === tabSelected);

    return (
        <IulQuoteContainer title="IUL Protection">
            <Grid item md={3} xs={12}>
                {isMobile && showFilters && (
                    <Box className={styles.countSortContainer}>
                        <Typography variant="body1" color="#434A51">
                            {lifeIulQuoteResults?.length || 0} IUL Protection Policies
                        </Typography>
                    </Box>
                )}
                <IulProtectionQuoteFilter />
            </Grid>
            {!showFilters && (
                <Grid item md={8} xs={12}>
                    <Box className={styles.countSortContainer}>
                        {!isMobile && (
                            <Box>
                                <Typography variant="body1" color="#434A51">
                                    {lifeIulQuoteResults?.length} IUL Protection Policies
                                </Typography>
                            </Box>
                        )}
                        <Box width={isMobile ? "100%" : "60%"}>
                            {filteredTabInputs?.length > 1 && (
                                <Tabs
                                    value={parseInt(selectedTabIndex) !== -1 ? parseInt(selectedTabIndex) : 0}
                                    aria-label="communications-tabs"
                                    variant="fullWidth"
                                    className={styles.tabs}
                                >
                                    {filteredTabInputs.map((faceAmount, index) => (
                                        <Tab
                                            key={`faceAmount-${index}`}
                                            active={tabSelected === faceAmount}
                                            activeColor="primary"
                                            label={`$${faceAmount}`}
                                            onClick={() => handleTabSelection(faceAmount, tempUserDetails)}
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
                                    guaranteedYears,
                                    cashValueYear20,
                                    cashValueYear30,
                                    maxIllustratedRate,
                                    indexStrategyType,
                                    distribution,
                                    deathBenefit,
                                    targetPremium,
                                    premium,
                                    rowId,
                                } = plan;
                                return (
                                    <Grid item md={12} key={`iul-protection-${index}`}>
                                        <IulQuoteCard
                                            quoteType="IUL Protection"
                                            cardTitle={productName}
                                            companyName={companyName}
                                            rating={amBest}
                                            logo={companyLogoImageUrl}
                                            guaranteedYears={guaranteedYears}
                                            cashValueYear20={cashValueYear20}
                                            cashValueYear30={cashValueYear30}
                                            maxIllustratedRate={maxIllustratedRate}
                                            indexStrategyType={indexStrategyType}
                                            isTobaccoUser={isTobaccoUser}
                                            targetPremium={targetPremium}
                                            deathBenefit={deathBenefit}
                                            distribution={distribution}
                                            age={plan?.input?.actualAge}
                                            healthClass={plan?.input?.healthClass}
                                            premium={premium}
                                            handleComparePlanSelect={() => {
                                                handleComparePlanSelect(plan);
                                            }}
                                            handlePlanDetailsClick={() => handlePlanDetailsClick(rowId)}
                                            disableCompare={
                                                selectedPlans?.length === 3 &&
                                                !selectedPlans?.find((p) => p.rowId === rowId)
                                            }
                                            isChecked={selectedPlans?.find((p) => p.rowId === rowId)}
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
