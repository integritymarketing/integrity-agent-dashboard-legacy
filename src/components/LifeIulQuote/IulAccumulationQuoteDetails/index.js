import { useRef, useEffect, useMemo } from "react";
import { Grid, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import PlanDetailsScrollNav from "components/ui/PlanDetailsScrollNav";
import { CollapsibleLayout ,
    IulQuoteCard,
    IulQuoteDetailsSection,
    ProductFeature,
    UnderwritingRequirements,
} from "@integritymarketing/clients-ui-kit";
import { IulQuoteContainer } from "../CommonComponents";

import { useLifeIulQuote } from "providers/Life";
import { useParams } from "react-router-dom";
import styles from "./styles.module.scss";

const IulAccumulationQuoteDetails = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const planDetailsSessionData = sessionStorage.getItem("iul-plan-details");
    const planDetails = JSON.parse(planDetailsSessionData);

    const quoteDetailsRef = useRef(null);
    const productDescriptionRef = useRef(null);
    const productFeaturesRef = useRef(null);
    const underwritingRequirementsRef = useRef(null);
    const { planId } = useParams();

    const { fetchLifeIulQuoteDetails, lifeIulDetails } = useLifeIulQuote();

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
                plans: [feature.value === "Included" ? true : feature.value === "Optional" ? "Optional" : false],
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
        cashValueAge65,
        maxIllustratedRate,
        indexStrategyType,
        distribution,
        deathBenefit,
        targetPremium,
        premium,
        isTobaccoUser,
    } = useMemo(() => {
        return planDetails;
    }, [planDetails]);

    return (
        <IulQuoteContainer title="IUL Accumulation" page="plans details page">
            <Grid container>
                {!isMobile && (
                    <Grid item md={3}>
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
                <Grid item md={8}>
                    <Grid container gap={3}>
                        <Grid item md={12} xs={12}>
                            <div ref={quoteDetailsRef} id="quoteDetails">
                                <CollapsibleLayout title="Quote Details">
                                    <IulQuoteCard
                                        isPlanDetailsPage={true}
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
                                        age={planDetails?.input?.actualAge}
                                        healthClass={planDetails?.input?.healthClass}
                                        premium={premium}
                                    />
                                </CollapsibleLayout>
                            </div>
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
        </IulQuoteContainer>
    );
};

export default IulAccumulationQuoteDetails;
