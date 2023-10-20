// External Packages
import React, { useEffect, useMemo } from "react";

// Internal Modules
import { FinalExpensesPlanCard } from "../FinalExpensesPlanCard";
import PlanCardLoader from "components/ui/PlanCard/loader";
import { useFinalExpensesPlansList } from "providers/FinalExpenses";

const QUOTE_ID = "390e04ef-be95-463d-9b76-46050cbf438c";

const FinalExpensesPlansList = () => {
  const {
    getFinalExpensesPlansList,
    finalExpensesPlansList,
    finalExpensesPlansLoading,
  } = useFinalExpensesPlansList();

  useEffect(() => {
    getFinalExpensesPlansList(QUOTE_ID);
  }, [getFinalExpensesPlansList]);

  console.log("finalExpensesPlansList", finalExpensesPlansList);

  const renderPlanCardLoaders = useMemo(() => {
    const loaders = Array.from({ length: 10 }, (_, i) => (
      <PlanCardLoader key={i} />
    ));
    return loaders;
  }, []);

  const renderPlanCards = useMemo(
    () =>
      finalExpensesPlansList?.map(
        ({
          Company,
          Rates,
          CompensationWarning,
          PolicyFee,
          IsSocialSecurityBillingSupported,
          PlanInfo,
          UnderwritingWarning,
        }) => (
          <FinalExpensesPlanCard
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
    [finalExpensesPlansList]
  );

  return (
    <>{finalExpensesPlansLoading ? renderPlanCardLoaders : renderPlanCards}</>
  );
};

export default FinalExpensesPlansList;
