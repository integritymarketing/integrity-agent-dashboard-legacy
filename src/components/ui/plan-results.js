import React, { useState } from "react";
import { useHistory } from "react-router";
import PlanCard from "./PlanCard";
import PlanCardLoader from "./PlanCard/loader";
import EnrollmentModal from "./Enrollment/enrollment-modal";

const PlanResults = ({
  plans,
  isMobile,
  effectiveDate,
  leadId,
  contact,
  pharmacies,
  loading,
}) => {
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const [enrollingPlan, setEnrollingPlan] = useState();
  const cards = [];
  const pharmacyMap = pharmacies.reduce((dict, item) => {
    dict[item["pharmacyID"]] = item;
    return dict;
  }, {});
  if (plans && plans.length) {
    var key = 0;
    for (const plan of plans) {
      cards.push(
        <PlanCard
          key={key++}
          planData={plan}
          effectiveDate={effectiveDate}
          isMobile={isMobile}
          pharmacyMap={pharmacyMap}
          onDetailsClick={() => history.push(`/${leadId}/plan/${plan.id}`)}
          onEnrollClick={() => {
            setEnrollingPlan(plan);
            setModalOpen(true);
          }}
        />
      );
    }
  } else if (!loading && (!plans || plans.length === 0)) {
    cards.push(<div key={"loading"} />);
  } else {
    for (let i = 0; i < 10; i++) {
      cards.push(<PlanCardLoader key={i}></PlanCardLoader>);
    }
  }
  return (
    <>
      <EnrollmentModal
        modalOpen={modalOpen}
        planData={enrollingPlan}
        contact={contact}
        handleCloseModal={() => setModalOpen(false)}
      />
      {cards}
    </>
  );
};

export default PlanResults;
