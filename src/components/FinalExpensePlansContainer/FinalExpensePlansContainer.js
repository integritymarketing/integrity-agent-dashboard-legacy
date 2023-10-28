import { useEffect, useMemo } from "react";

import { FinalExpensePlanCard } from "./FinalExpensePlanCard";
import { AccurateQuoteBannerCard } from "./AccurateQuoteBannerCard";
import PlanCardLoader from "components/ui/PlanCard/loader";
import { useFinalExpensePlans } from "providers/FinalExpense";

const QUOTE_ID = "390e04ef-be95-463d-9b76-46050cbf438c";

export const FinalExpensePlansContainer = () => {
    const { getFinalExpensePlans, finalExpensePlans, isLoadingFinalExpensePlans } = useFinalExpensePlans();

    useEffect(() => {
        getFinalExpensePlans(QUOTE_ID);
    }, [getFinalExpensePlans]);

    const renderPlanCardLoaders = useMemo(() => {
        const loaders = Array.from({ length: 10 }, (_, i) => <PlanCardLoader key={i} />);
        return loaders;
    }, []);

    const renderPlanCards = useMemo(
        () =>
            finalExpensePlans?.map(
                ({
                    Company,
                    Rates,
                    CompensationWarning,
                    PolicyFee,
                    IsSocialSecurityBillingSupported,
                    PlanInfo,
                    UnderwritingWarning,
                }) => (
                    <FinalExpensePlanCard
                        key={PlanInfo}
                        company={Company}
                        rates={Rates}
                        compensationWarning={CompensationWarning}
                        policyFee={PolicyFee}
                        isSocialSecurityBillingSupported={IsSocialSecurityBillingSupported}
                        planInfo={PlanInfo}
                        underwritingWarning={UnderwritingWarning}
                    />
                )
            ),
        [finalExpensePlans]
    );

    return (
        <>
            {isLoadingFinalExpensePlans ? (
                renderPlanCardLoaders
            ) : (
                <>
                    <AccurateQuoteBannerCard />
                    {renderPlanCards}
                </>
            )}
        </>
    );
};
