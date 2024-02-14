import React, { useState } from "react";
import { useNavigate } from "react-router";

import { formatDate } from "utils/dates";

import useAnalytics from "hooks/useAnalytics";
import { PLAN_TYPE_ENUMS } from "../../constants";

import EnrollmentModal from "./Enrollment/enrollment-modal";
import PlanCard from "./PlanCard";
import PlanCardLoader from "./PlanCard/loader";
import { planTypesMap } from "./PlanTypesFilter";

export const convertPlanTypeToValue = (value, planTypesMap) => {
    const type = planTypesMap.find((element) => element.value === Number(value));
    return type?.label || planTypesMap[0].label;
};
const PlanResults = ({
    plans,
    isMobile,
    effectiveDate,
    leadId,
    contact,
    pharmacies,
    loading,
    planType,
    setSelectedPlans,
    selectedPlans,
    setSessionData,
    refresh,
}) => {
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();
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
                    contact={contact}
                    key={key++}
                    planData={plan}
                    effectiveDate={effectiveDate}
                    isMobile={isMobile}
                    pharmacyMap={pharmacyMap}
                    onDetailsClick={() => {
                        setSessionData();
                        navigate(`/${leadId}/plan/${plan.id}/${formatDate(effectiveDate, "yyyy-MM-01")}`);
                    }}
                    onEnrollClick={() => {
                        fireEvent("Health Apply CTA Clicked", {
                            leadid: leadId,
                            line_of_business: "Health",
                            product_type: PLAN_TYPE_ENUMS[planType]?.toLowerCase(),
                        });
                        setEnrollingPlan(plan);
                        setModalOpen(true);
                    }}
                    onChangeCompare={(checked) => {
                        setSelectedPlans((prev) => ({ ...prev, [plan.id]: checked }));
                    }}
                    isChecked={!!selectedPlans[plan.id]}
                    isCompareDisabled={
                        Object.values(selectedPlans).filter(Boolean).length >= 3 && !selectedPlans[plan.id]
                    }
                    refresh={refresh}
                />
            );
        }
    } else if (!loading && (!plans || plans == null || plans.length === 0)) {
        const planTypeString = convertPlanTypeToValue(planType, planTypesMap);
        cards.push(
            <div key={"NoResultsCard"} className={"plan-card no-plan-results"}>
                {`No ${planTypeString} plans available. Review the selected filters and/or contact information.`}
            </div>
        );
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
                effectiveDate={formatDate(effectiveDate, "yyyy-MM-01")}
            />
            {cards}
        </>
    );
};

export default PlanResults;
