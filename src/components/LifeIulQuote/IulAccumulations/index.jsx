import { useCallback, useEffect, useState } from "react";
import { IulQuoteContainer, IulAccumulationQuoteFilter, ApplyErrorModal } from "../CommonComponents";
import { IulQuoteCard, NoQuoteResult } from "@integritymarketing/clients-ui-kit";
import { Grid, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { useLifeIulQuote } from "providers/Life";
import styles from "./styles.module.scss";
import WithLoader from "components/ui/WithLoader";
import { useParams, useNavigate } from "react-router-dom";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import { useLeadDetails } from "providers/ContactDetails";

const IulAccumulationQuote = () => {
    const {
        fetchLifeIulQuoteResults,
        isLoadingLifeIulQuote,
        lifeIulQuoteResults,
        showFilters,
        handleComparePlanSelect,
        selectedPlans,
        handleIULQuoteApplyClick,
        isLoadingApplyLifeIulQuote,
    } = useLifeIulQuote();

    const { leadDetails } = useLeadDetails();
    const [isTobaccoUser, setIsTobaccoUser] = useState(false);
    const { agentInformation } = useAgentInformationByID();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { contactId } = useParams();
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState({});
    const [applyErrorModalOpen, setApplyErrorModalOpen] = useState(false);

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

    const handlePlanDetailsClick = (id) => {
        const filteredPlan = lifeIulQuoteResults.filter((item) => id === item.recId);

        if (filteredPlan.length > 0) {
            sessionStorage.setItem("iul-plan-details", JSON.stringify({ ...filteredPlan[0], isTobaccoUser }));
            const tempId = "IUL-United of Omaha-Income Advantage IUL";
            navigate(`/life/iul-accumulation/${contactId}/${tempId}/quote-details`);
        }
    };

    const handleNavigateToLearningCenter = () => {
        window.open("/learning-center", "_blank");
    };

    const handleApplyClick = async (plan) => {
        setSelectedPlan(plan);
        try {
            const response = await handleIULQuoteApplyClick(
                { ...plan, ...agentInformation, ...leadDetails },
                contactId
            );
            if (response.success) {
                setSelectedPlan({});
            } else {
                setApplyErrorModalOpen(true);
                setSelectedPlan({});
            }
        } catch (error) {
            setApplyErrorModalOpen(true);
            setSelectedPlan({});
        }
    };

    return (
        <IulQuoteContainer title="IUL Accumulation" page="plans page" quoteType="accumulation">
            <Grid item md={3} xs={12}>
                {isMobile && showFilters && (
                    <Box className={styles.countSortContainer}>
                        <Typography variant="body1" className={styles.countSortText}>
                            {lifeIulQuoteResults?.length || 0} IUL Accumulation Policies
                        </Typography>
                    </Box>
                )}
                <IulAccumulationQuoteFilter isTobaccoUser={isTobaccoUser} />
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
                            {lifeIulQuoteResults?.length > 0 && !isLoadingLifeIulQuote ? (
                                <>
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
                                            rowId,
                                            recId,
                                        } = plan;
                                        return (
                                            <Grid
                                                item
                                                md={12}
                                                key={`iul-accumulation-${index}`}
                                                sx={{ position: "relative" }}
                                            >
                                                <IulQuoteCard
                                                    applyButtonDisabled={isLoadingApplyLifeIulQuote}
                                                    quoteType="IUL Accumulation"
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
                                                    handleApplyClick={() => handleApplyClick(plan)}
                                                    age={plan?.input?.actualAge}
                                                    healthClass={plan?.input?.healthClass}
                                                    handleComparePlanSelect={() => handleComparePlanSelect(plan)}
                                                    handlePlanDetailsClick={() =>
                                                        handlePlanDetailsClick(plan.recId)
                                                    }
                                                    disableCompare={
                                                        selectedPlans?.length === 3 &&
                                                        !selectedPlans?.find((p) => p.recId === recId)
                                                    }
                                                    isChecked={selectedPlans?.find(
                                                        (p) => p.recId === recId
                                                    )}
                                                />
                                                {selectedPlan.rowId === rowId && (
                                                    <Box sx={{ position: "absolute", top: 0, left: "50%" }}>
                                                        <WithLoader isLoading={isLoadingApplyLifeIulQuote}></WithLoader>
                                                    </Box>
                                                )}
                                            </Grid>
                                        );
                                    })}
                                </>
                            ) : (
                                <NoQuoteResult navigateLearningCenter={handleNavigateToLearningCenter} />
                            )}
                        </Grid>
                        <ApplyErrorModal open={applyErrorModalOpen} onClose={() => setApplyErrorModalOpen(false)} />
                    </WithLoader>
                </Grid>
            )}
        </IulQuoteContainer>
    );
};

export default IulAccumulationQuote;
```