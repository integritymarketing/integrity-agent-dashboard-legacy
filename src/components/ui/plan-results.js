import React from "react";
import { useHistory } from "react-router";
import PlanCard from "./PlanCard";
import PlanCardLoader from "./PlanCard/loader";
const PlanResults = ({ plans, isMobile, effectiveDate }) => {
  const history = useHistory();
  const cards = [];
  if (plans && plans.length) {
    for (const plan of plans) {
      cards.push(
        <PlanCard
          planData={plan}
          effectiveDate={effectiveDate}
          isMobile={isMobile}
          onDetailsClick={() => history.push(`/plan/${plan.id}`)}
          onEnrollClick={() => console.log("enroll")}
        />
      );
    }
  } else {
    for (let i = 0; i < 10; i++) {
      cards.push(<PlanCardLoader></PlanCardLoader>);
    }
  }
  return <>{cards}</>;
};

export default PlanResults;
