import React from "react";
import PlanList from "./PlanList";
import QuotePlanListProvider from "contexts/QuotePlanList";

const QuotePlans = () => {
  return (
    <QuotePlanListProvider>
      <PlanList />
    </QuotePlanListProvider>
  );
};

export default QuotePlans;

//   Usage of this Component //

//   import QuotePlans from "components/FinalExpensivePlans"; //

//  <QuotePlans /> //
