import  { useCallback, useEffect, useState, useMemo } from "react";
import { Grid, Box} from "@mui/material";
import { CompareHeader, ProductFeature, UnderwritingRequirements } from "@integritymarketing/clients-ui-kit";
import { IulQuoteContainer } from "../CommonComponents";
import { useLifeIulQuote } from "providers/Life";
import { useParams } from "react-router-dom";
import styles from "./styles.module.scss";

const IulProtectionComparePlans = () => {
    const [results, setResults] = useState([]);
    const { planIds: comparePlanIds } = useParams();
    const planIds = useMemo(() => comparePlanIds.split(","), [comparePlanIds]);
    const comparePlansSessionData = sessionStorage.getItem("iul-compare-plans");
    const comparePlans = JSON.parse(comparePlansSessionData);
    const { fetchLifeIulQuoteDetails } = useLifeIulQuote();

    const getPlanDetails = useCallback(async () => {
        const getAllPlanDetails = () => {
            return Promise.all(planIds.filter(Boolean).map((planId) => fetchLifeIulQuoteDetails(planId)));
        };
        const plansData = await getAllPlanDetails();
        setResults(plansData);
    }, [planIds, fetchLifeIulQuoteDetails]);

    useEffect(() => {
        getPlanDetails();
    }, [planIds, getPlanDetails]);

    const features = useMemo(() => {
        const combinedBenefits = [];
        const benefitNames = new Set();

        results.forEach((item) => {
            item.benefits.forEach((benefit) => {
                benefitNames.add(benefit.name);
            });
        });

        benefitNames.forEach((name) => {
            const benefitObj = {
                name: name,
                description: "",
                plans: results.map((item) =>
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
                deathBenefit: plan.deathBenefit,
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
        console.log("IulProtectionComparePlans -> val", val);
    };

    return (
        <IulQuoteContainer title="IUL Protection" page="plan compare page">
            <Grid container gap={3}>
                <Grid item md={12}>
                    <CompareHeader
                        headerCategory="IUL_PROTECTION"
                        IULProtectionPlans={plansData}
                        onClose={handleComparePlanRemove}
                        shareComparePlanModal={handleShareModal}
                    />
                </Grid>
                {features?.length > 0 && (
                    <Grid item md={12}>
                        <ProductFeature title="Product Features" features={features} />
                    </Grid>
                )}

                <Grid item md={12}>
                    <Box className={styles.underwritingRequirements}>
                        <UnderwritingRequirements requirements={uwRequirements} title="Underwriting Requirements" />
                    </Box>
                </Grid>
            </Grid>
        </IulQuoteContainer>
    );
};

export default IulProtectionComparePlans;