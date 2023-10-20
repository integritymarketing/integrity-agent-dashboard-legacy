import React, { useMemo } from "react";
import PlanCard from "./PlanCard";
import PlanCardLoader from "components/ui/PlanCard/loader";
import { QuotePlanListContext } from "contexts/QuotePlanList";

const PlansList = () => {
  const { quotePlanList } = QuotePlanListContext();

  const renderPlanCardLoaders = useMemo(() => {
    const loaders = [];
    for (let i = 0; i < 10; i++) {
      loaders.push(<PlanCardLoader key={i} />);
    }
    return loaders;
  }, []);

  const renderPlanCards = useMemo(
    () =>
      quotePlanList?.map(
        ({
          Company,
          Rates,
          CompensationWarning,
          PolicyFee,
          IsSocialSecurityBillingSupported,
          PlanInfo,
          UnderwritingWarning,
        }) => (
          <PlanCard
            Company={Company}
            Rates={Rates}
            CompensationWarning={CompensationWarning}
            PolicyFee={PolicyFee}
            IsSocialSecurityBillingSupported={IsSocialSecurityBillingSupported}
            PlanInfo={PlanInfo}
            UnderwritingWarning={UnderwritingWarning}
          />
        )
      ),
    [quotePlanList]
  );

  return (
    <>{quotePlanList.length === 0 ? renderPlanCardLoaders : renderPlanCards}</>
  );
};

export default PlansList;
