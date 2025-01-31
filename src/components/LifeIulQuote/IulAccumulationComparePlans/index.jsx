import { useEffect, useState, useMemo } from "react";
import { Grid, Box } from "@mui/material";

import { CompareHeader, ProductFeature, UnderwritingRequirements } from "@integritymarketing/clients-ui-kit";
import { IulQuoteContainer } from "../CommonComponents";
import { useNavigate , useParams } from "react-router-dom";

import { useLifeIulQuote } from "providers/Life";

import styles from "./styles.module.scss";

const IulAccumulationComparePlans = () => {
    const [results, setResults] = useState([]);

    const { planIds: comparePlanIds, contactId } = useParams();
    const planIds = useMemo(() => comparePlanIds.split(","), [comparePlanIds]);
    const comparePlansSessionData = sessionStorage.getItem("iul-compare-plans");
    const comparePlans = JSON.parse(comparePlansSessionData);
    const navigate = useNavigate();

    const { fetchLifeIulQuoteDetails } = useLifeIulQuote();

    function getAllPlanDetails(planIds) {
        return Promise.all(planIds.filter(Boolean).map((planId) => fetchLifeIulQuoteDetails(planId)));
    }

    const getPlanDetails = async (planIds) => {
        const plansData = await getAllPlanDetails(planIds);
        setResults(plansData);
    };

    useEffect(() => {
        getPlanDetails(planIds);
    }, [planIds]);

    const features = useMemo(() => {
        const combinedBenefits = [];
        const benefitNames = new Set();

        // Collect all benefit names
        results?.forEach((item) => {
            item?.benefits?.forEach((benefit) => {
                benefitNames.add(benefit.name);
            });
        });

        // Create the desired structure
        benefitNames?.forEach((name) => {
            const benefitObj = {
                name: name,
                description: "",
                plans: results?.map((item) =>
                    item.benefits.some((benefit) => benefit.name === name && benefit.value === "Included")
                ),
            };
            combinedBenefits.push(benefitObj);
        });

        return combinedBenefits;
    }, [results]);

    const uwRequirements = useMemo(() => {
        const combinedRequirements = results.flatMap((item) => item.uwRequirements || []);

        const result = combinedRequirements.reduce((acc, requirement) => {
            const title = requirement.sectionName;
            const items = requirement.names;

            // Check if the title already exists in the result
            const existingCategory = acc.find((category) => category.title === title);
            if (existingCategory) {
                existingCategory.data.push({ items });
            } else {
                acc.push({
                    title,
                    data: [{ items }],
                    displayType: requirement.displayType,
                });
            }
            return acc;
        }, []);

        return result;
    }, [results]);

    const plansData = useMemo(() => {
        return comparePlans.map((plan) => {
            return {
                logoURL: plan.companyLogoImageUrl,
                id: plan.policyDetailId,
                annualPlanPremium: plan.targetPremium,
                distribution: plan.distribution,
                carrierName: plan.companyName,
                planRating: plan.amBest,
                planName: plan.productName,
            };
        });
    }, [comparePlans]);

    const handleComparePlanRemove = (id) => {
        const updatedPlans = comparePlans.filter((plan) => plan.policyDetailId !== id);
        sessionStorage.setItem("iul-compare-plans", JSON.stringify(updatedPlans));
        window.location.reload();
    };

    const handleShareModal = (val) => {
        console.log("IulAccumulationComparePlans -> val", val);
    };

    const returnBackToPlansPage = () => {
        navigate(`/life/iul-accumulation/${contactId}/quote?preserveSelected=true`);
    };

    return (
        <IulQuoteContainer title="IUL Accumulation" page="plan compare page" quoteType="accumulation">
            <Grid container gap={3}>
                <Grid item md={12} className={styles.planCompareHeader}>
                    <CompareHeader
                        headerCategory="IUL_ACCUMULATION"
                        IULAccumulationPlans={plansData}
                        onClose={handleComparePlanRemove}
                        shareComparePlanModal={handleShareModal}
                        returnBackToPlansPage={returnBackToPlansPage}
                    />
                </Grid>
                {features?.length > 0 && (
                    <Grid item md={12} className={styles.productFeature}>
                        <ProductFeature title="Product Features" features={features} />
                    </Grid>
                )}

                <Grid item md={12} className={styles.underwritingRequirements}>
                    <Box >
                        <UnderwritingRequirements requirements={uwRequirements} title="Underwriting Requirements" />
                    </Box>
                </Grid>
            </Grid>
        </IulQuoteContainer>
    );
};

export default IulAccumulationComparePlans;
