import React, { useRef, useEffect, useMemo } from "react";
import { Grid, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import PlanDetailsScrollNav from "components/ui/PlanDetailsScrollNav";
import { CollapsibleLayout } from "@integritymarketing/clients-ui-kit";
import { IulQuoteContainer } from "../CommonComponents";
import {
    IulQuoteCard,
    IulQuoteDetailsSection,
    ProductFeature,
    FooterNotes,
    UnderwritingRequirements,
} from "@integritymarketing/clients-ui-kit";
import { useLifeIulQuote } from "providers/Life";
import { useParams } from "react-router-dom";
import styles from "./styles.module.scss";

const FOOTER_NOTES = [
    {
        label: "7",
        text: "The price displayed for this drug may be lower than what you would typically pay during this period because of additional gap coverage offered by this plan",
    },
    {
        label: "15",
        text: "Any amount you spend for a non-formulary drug is not counted towards the deductible, initial coverage limit, or out-of-pocket costs UNLESS the plan approves a formulary exception.",
    },
    {
        label: "A",
        text: "This drug may be covered under Medicare Part B or D depending upon the circumstances. Information may need to be submitted describing the use and setting of the drug to make the determination.",
    },
];

const IulProtectionQuoteDetails = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                data: [
                    {
                        items: requirement.names,
                    },
                ],
            };
        });
    }, [underwritingRequirements]);

    return (
        <IulQuoteContainer title="IUL Protection" page="plans details page" >
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
                        <Grid item md={12}>
                            <div ref={quoteDetailsRef} id="quoteDetails">
                                <CollapsibleLayout title="Quote Details">
                                    <IulQuoteCard quoteType="IUL Protection Details" isPlanDetailsPage={true} />
                                </CollapsibleLayout>
                            </div>
                        </Grid>
                        <Grid item md={12}>
                            <div ref={productDescriptionRef} id="productDescription">
                                <IulQuoteDetailsSection title="Product Description">
                                    <Typography variant="body1" color="#434A51">
                                        {description}
                                    </Typography>
                                </IulQuoteDetailsSection>
                            </div>
                        </Grid>
                        {features?.length > 0 && (
                            <Grid item md={12}>
                                <div ref={productFeaturesRef} id="productFeatures">
                                    <ProductFeature title="Product Features" features={features} />
                                </div>
                            </Grid>
                        )}

                        <Grid item md={12}>
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
                        <FooterNotes footnotes={FOOTER_NOTES} />
                    </Grid>
                </Grid>
            </Grid>
        </IulQuoteContainer>
    );
};

export default IulProtectionQuoteDetails;