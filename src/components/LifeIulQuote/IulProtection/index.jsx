import { useCallback, useEffect, useMemo, useState } from "react";
import { IulQuoteContainer, IulProtectionQuoteFilter, ApplyErrorModal } from "../CommonComponents";
import { IulQuoteCard, NoQuoteResult } from "@integritymarketing/clients-ui-kit";
import { Grid, Typography, Box, Tab, Tabs, useTheme, useMediaQuery } from "@mui/material";
import { useLifeIulQuote } from "providers/Life";
import WithLoader from "components/ui/WithLoader";
import styles from "./styles.module.scss";
import { useParams, useNavigate } from "react-router-dom";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import { useLeadDetails } from "providers/ContactDetails";

const IulProtectionQuote = () => {
    const {
        fetchLifeIulQuoteResults,
        isLoadingLifeIulQuote,
        lifeIulQuoteResults,
        handleTabSelection,
        tabSelected,
        showFilters,
        tempUserDetails,
        handleComparePlanSelect,
        selectedPlans,
        isLoadingApplyLifeIulQuote,
        handleIULQuoteApplyClick,
    } = useLifeIulQuote();

    const { leadDetails } = useLeadDetails();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { contactId } = useParams();
    const navigate = useNavigate();
    const [isTobaccoUser, setIsTobaccoUser] = useState(false);
    const { agentInformation } = useAgentInformationByID();
    const [selectedPlan, setSelectedPlan] = useState({});
    const [applyErrorModalOpen, setApplyErrorModalOpen] = useState(false);

    const getQuoteResults = useCallback(async () => {
        const lifeQuoteProtectionDetails = sessionStorage.getItem("lifeQuoteProtectionDetails");

        if (lifeQuoteProtectionDetails) {
            const parsedLifeQuoteProtectionDetails = JSON.parse(lifeQuoteProtectionDetails);

            setIsTobaccoUser(parsedLifeQuoteProtectionDetails.isTobaccoUser);
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
        const filteredPlan = lifeIulQuoteResults.filter((item) => id === item.recId);

        if (filteredPlan.length > 0) {
            sessionStorage.setItem("iul-plan-details", JSON.stringify({ ...filteredPlan[0], isTobaccoUser }));
            const tempId = "IUL-United of Omaha-Life Protection Advantage IUL";
            navigate(`/life/iul-protection/${contactId}/${tempId}/quote-details`);
        }
    };

    const handleNavigateToLearningCenter = () => {
        window.open("/learning-center", "_blank");
    };

    const handleApplyClick = async (plan) => {
        setSelectedPlan(plan);

        const emailAddress = leadDetails?.emails?.length > 0 ? leadDetails.emails[0].leadEmail : null;
        const phoneNumber = leadDetails?.phones?.length > 0 ? leadDetails.phones[0].leadPhone : null;

        try {
            const response = await handleIULQuoteApplyClick(
                {
                    ...plan,
                    ...agentInformation,
                    ...leadDetails,
                    emailAddress,
                    phoneNumber,
                },
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
            console.error("Error applying for quote:", error);
        } finally {
            setSelectedPlan({});
        }
    };

    const lifeQuoteProtectionDetails = sessionStorage.getItem("lifeQuoteProtectionDetails");

    const tabInputs = useMemo(() => {
        const parsedLifeQuoteProtectionDetails = JSON.parse(lifeQuoteProtectionDetails);
        const faceAmounts = parsedLifeQuoteProtectionDetails?.faceAmounts;
        return faceAmounts;
    }, [lifeQuoteProtectionDetails]);

    const filteredTabInputs = tabInputs.filter((tab) => Boolean(tab));
    const selectedTabIndex = filteredTabInputs.findIndex((tab) => tab === tabSelected);

    return (
        <IulQuoteContainer title="IUL Protection" page="plans page" quoteType="protection">
            <Grid item md={3} xs={12}>
                {isMobile && showFilters && (
                    <Box className={styles.countSortContainer}>
                        <Typography variant="body1" className={styles.countSortText}>
                            {lifeIulQuoteResults?.length || 0} IUL Protection Policies
                        </Typography>
                    </Box>
                )}
                <IulProtectionQuoteFilter isTobaccoUser={isTobaccoUser} />
            </Grid>
            {!showFilters && (
                <Grid item md={8} xs={12}>
                    <Box className={styles.countSortContainer}>
                        {!isMobile && (
                            <Box>
                                <Typography variant="body1" className={styles.countSortText}>
                                    {lifeIulQuoteResults?.length} IUL Protection Policies
                                </Typography>
                            </Box>
                        )}
                        <Box width={isMobile ? "100%" : "60%"} marginBottom="16px">
                            {filteredTabInputs?.length > 1 && (
                                <Tabs
                                    value={parseInt(selectedTabIndex) !== -1 ? parseInt(selectedTabIndex) : false}
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
                            {lifeIulQuoteResults?.length > 0 && !isLoadingLifeIulQuote ? (
                                <>
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
                                            recId,
                                        } = plan;
                                        return (
                                            <Grid
                                                item
                                                md={12}
                                                key={`iul-protection-${index}`}
                                                sx={{ position: "relative" }}
                                            >
                                                <IulQuoteCard
                                                    applyButtonDisabled={isLoadingApplyLifeIulQuote}
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
                                                    handleApplyClick={() => handleApplyClick(plan)}
                                                    premium={premium}
                                                    handleComparePlanSelect={() => {
                                                        handleComparePlanSelect(plan);
                                                    }}
                                                    handlePlanDetailsClick={() => handlePlanDetailsClick(recId)}
                                                    disableCompare={
                                                        selectedPlans?.length === 3 &&
                                                        !selectedPlans?.find((p) => p.recId === recId)
                                                    }
                                                    isChecked={selectedPlans?.find((p) => p.recId === recId)}
                                                />
                                                {selectedPlan?.rowId === rowId && (
                                                    <Box sx={{ position: "absolute", top: 0, left: "50%" }}>
                                                        <WithLoader isLoading={isLoadingApplyLifeIulQuote} />
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

export default IulProtectionQuote;
