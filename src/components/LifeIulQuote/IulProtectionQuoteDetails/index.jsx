import React, { useRef, useEffect, useMemo, useState} from "react";
import { Grid, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import PlanDetailsScrollNav from "components/ui/PlanDetailsScrollNav";
import {
    CollapsibleLayout,
    IulQuoteCard,
    IulQuoteDetailsSection,
    ProductFeature,
    UnderwritingRequirements,
} from "@integritymarketing/clients-ui-kit";
import { IulQuoteContainer, ApplyErrorModal, IulShareModal } from "../CommonComponents";
import { useLifeIulQuote } from "providers/Life";
import { useParams } from "react-router-dom";
import styles from "./styles.module.scss";
import { useLeadDetails } from "providers/ContactDetails";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import WithLoader from "components/ui/WithLoader";

const IulProtectionQuoteDetails = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const planDetailsSessionData = sessionStorage.getItem("iul-plan-details");
    const planDetails = JSON.parse(planDetailsSessionData);
    const [shareModalOpen, setShareModalOpen] = useState(false);

    const quoteDetailsRef = useRef(null);
    const productDescriptionRef = useRef(null);
    const productFeaturesRef = useRef(null);
    const underwritingRequirementsRef = useRef(null);
    const { planId, contactId } = useParams();
    const { leadDetails } = useLeadDetails();
    const { agentInformation } = useAgentInformationByID();
    const [applyErrorModalOpen, setApplyErrorModalOpen] = useState(false);

    const { fetchLifeIulQuoteDetails, lifeIulDetails, handleIULQuoteApplyClick, isLoadingApplyLifeIulQuote } =
        useLifeIulQuote();

    useEffect(() => {
        fetchLifeIulQuoteDetails(planId);
    }, [planId]);

    const description = lifeIulDetails?.description || "";
    const underwritingRequirements = lifeIulDetails?.uwRequirements || [];

    const features = useMemo(() => {
        return lifeIulDetails?.benefits.map((feature) => {
            return {
                name: feature.name,
                description: feature.description || "",
                plans: [feature.value || "Excluded"],
            };
        });
    }, [lifeIulDetails]);

    const uwRequirements = useMemo(() => {
        return underwritingRequirements.map((requirement) => {
            return {
                title: requirement.sectionName,
                displayType: requirement.displayType,
                data: [
                    {
                        items: requirement.names,
                    },
                ],
            };
        });
    }, [underwritingRequirements]);

    const {
        productName,
        companyName,
        amBest,
        companyLogoImageUrl,
        cashValueYear10,
        cashValueYear20,
        cashValueYear30,
        cashValueAge65,
        maxIllustratedRate,
        indexStrategyType,
        distribution,
        deathBenefit,
        targetPremium,
        isTobaccoUser,
        premium,
        guaranteedYears,
    } = useMemo(() => {
        return planDetails;
    }, [planDetails]);

    const handleApplyClick = async (plan) => {
        const emailAddress = leadDetails?.emails?.length > 0 ? leadDetails.emails[0].leadEmail : null;
        const phoneNumber = leadDetails?.phones?.length > 0 ? leadDetails.phones[0].leadPhone : null;

        try {
            const response= await handleIULQuoteApplyClick(
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
            }
            else{
                setApplyErrorModalOpen(true);
                setSelectedPlan({});
            }
        } catch (error) {
            setApplyErrorModalOpen(true);
            console.error("Error applying for quote:", error);
        }
    };

    return (
        <IulQuoteContainer title="IUL Protection" page="plans details page" quoteType="protection">
            <Grid container>
                {!isMobile && (
                    <Grid item md={3} sm={5}>
                        <Box marginBottom={"8px"}>
                            <Typography variant="h4" color="#052A63">
                                Overview
                            </Typography>
                        </Box>
                        <Box className={styles.tabsContainer}>
                            <PlanDetailsScrollNav
                                quoteType="IUL Details Page"
                                initialSectionID="quoteDetails"
                                scrollToInitialSection={false}
                                hidePharmacy
                                sections={[
                                    { id: "quoteDetails", label: "Quote Details" },
                                    { id: "productDescription", label: "Product Description" },
                                    { id: "productFeatures", label: "Product Features" },
                                    { id: "underwritingRequirements", label: "Underwriting Requirements" },
                                ]}
                                ref={{
                                    quoteDetails: quoteDetailsRef,
                                    productDescription: productDescriptionRef,
                                    productFeatures: productFeaturesRef,
                                    underwritingRequirements: underwritingRequirementsRef,
                                }}
                            />
                        </Box>
                    </Grid>
                )}
                <Grid item md={8} sm={6}>
                    <Grid container gap={3}>
                        <Grid item md={12} xs={12} sx={{ position: "relative" }}>
                            <div ref={quoteDetailsRef} id="quoteDetails">
                                <CollapsibleLayout title="Quote Details">
                                    <IulQuoteCard
                                        applyButtonDisabled={isLoadingApplyLifeIulQuote}
                                        isPlanDetailsPage={true}
                                        quoteType="IUL Protection"
                                        cardTitle={productName}
                                        companyName={companyName}
                                        rating={amBest}
                                        logo={companyLogoImageUrl}
                                        cashValueYear10={cashValueYear10}
                                        cashValueYear20={cashValueYear20}
                                        cashValueYear30={cashValueYear30}
                                        cashValueAge65={cashValueAge65}
                                        maxIllustratedRate={maxIllustratedRate}
                                        indexStrategyType={indexStrategyType}
                                        isTobaccoUser={isTobaccoUser}
                                        targetPremium={targetPremium}
                                        deathBenefit={deathBenefit}
                                        distribution={distribution}
                                        age={planDetails?.input?.actualAge}
                                        healthClass={planDetails?.input?.healthClass}
                                        premium={premium}
                                        guaranteedYears={guaranteedYears}
                                        handlePlanShareClick={() => setShareModalOpen(true)}
                                        handleApplyClick={() => handleApplyClick(planDetails)}
                                    />
                                </CollapsibleLayout>
                            </div>
                            {isLoadingApplyLifeIulQuote && (
                                <Box sx={{ position: "absolute", top: 0, left: "50%" }}>
                                    <WithLoader isLoading={isLoadingApplyLifeIulQuote} />
                                </Box>
                            )}
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <div ref={productDescriptionRef} id="productDescription">
                                <IulQuoteDetailsSection title="Product Description">
                                    <Typography variant="body1" color="#434A51">
                                        {description}
                                    </Typography>
                                </IulQuoteDetailsSection>
                            </div>
                        </Grid>
                        {features?.length > 0 && (
                            <Grid item md={12} xs={12}>
                                <div ref={productFeaturesRef} id="productFeatures">
                                    <ProductFeature title="Product Features" features={features} />
                                </div>
                            </Grid>
                        )}

                        <Grid item md={12} xs={12}>
                            <div
                                ref={underwritingRequirementsRef}
                                id="underwritingRequirements"
                                className={styles.underwritingRequirements}
                            >
                                <UnderwritingRequirements
                                    requirements={uwRequirements}
                                    title="Underwriting Requirements"
                                    isPlanDetailsPage={true}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <ApplyErrorModal open={applyErrorModalOpen} onClose={() => setApplyErrorModalOpen(false)} />
            {shareModalOpen && (
                <IulShareModal
                    open={shareModalOpen}
                    onClose={() => setShareModalOpen(false)}
                    planDetails={planDetails}
                    quoteType="accumulation"
                />
            )}
        </IulQuoteContainer>
    );
};

export default IulProtectionQuoteDetails;
