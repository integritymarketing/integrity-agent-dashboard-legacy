// External Packages
import React, { useEffect, useMemo } from "react";

// Internal Modules
import { FinalExpensePlanCard } from "../FinalExpensePlanCard";
import PlanCardLoader from "components/ui/PlanCard/loader";
import { useFinalExpensePlansList } from "providers/FinalExpense";

const QUOTE_ID = "390e04ef-be95-463d-9b76-46050cbf438c";

const FinalExpensePlansList = () => {
  const {
    getFinalExpensePlansList,
    finalExpensePlansList,
    isLoadingFinalExpensePlans,
  } = useFinalExpensePlansList();

  useEffect(() => {
    getFinalExpensePlansList(QUOTE_ID);
  }, [getFinalExpensePlansList]);

  const renderPlanCardLoaders = useMemo(() => {
    const loaders = Array.from({ length: 10 }, (_, i) => (
      <PlanCardLoader key={i} />
    ));
    return loaders;
  }, []);

  const renderPlanCards = useMemo(
    () =>
      finalExpensePlansList?.map(
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
    [finalExpensePlansList]
  );

  return (
    <>{isLoadingFinalExpensePlans ? renderPlanCardLoaders : renderPlanCards}</>
  );
  
};

export default FinalExpensePlansList;
