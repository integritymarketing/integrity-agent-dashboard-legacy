import React, { useEffect, useMemo, useRef, useState } from "react";
import Media from "react-media";
import { useParams } from "react-router-dom";

import PropTypes from "prop-types";
import { useFinalExpensePlans } from "providers/FinalExpense";

import { formatDate, formatServerDate, getAgeFromBirthDate } from "utils/dates";
import { scrollTop } from "utils/shared-utils/sharedUtility";

import useFetch from "hooks/useFetch";

import { HEALTH_CONDITION_API } from "components/FinalExpenseHealthConditionsContainer/FinalExpenseHealthConditionsContainer.constants";
import {
    COVERAGE_AMOUNT,
    COVERAGE_TYPE,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import { STEPPER_FILTER } from "components/FinalExpensePlansContainer/FinalexpensePlanOptioncard/FinalexpensePlanOptioncard.constants";
import { BackToTop } from "components/ui/BackToTop";
import Pagination from "components/ui/Pagination/pagination";
import PlanCardLoader from "components/ui/PlanCard/loader";
import WithLoader from "components/ui/WithLoader";

import useContactDetails from "pages/ContactDetails/useContactDetails";

import { PlanCard } from "./PlanCard";
import styles from "./PlanDetailsContainer.module.scss";

import PersonalisedQuoteBox from "../PersonalisedQuoteBox/PersonalisedQuoteBox";

export const PlanDetailsContainer = ({ selectedTab, coverageType, coverageAmount, monthlyPremium }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [pagedResults, setPagedResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { contactId } = useParams();
    const healthConditionsDataRef = useRef(null);
    const [finalExpensePlans, setFinalExpensePlans] = useState([]);
    const { getFinalExpenseQuotePlans } = useFinalExpensePlans();
    const [isLoadingHealthConditions, setIsLoadingHealthConditions] = useState(true);
    const [isLoadingFinalExpensePlans, setIsLoadingFinalExpensePlans] = useState(false);
    const { leadDetails } = useContactDetails(contactId);

    const { Get: getHealthConditions } = useFetch(`${HEALTH_CONDITION_API}${contactId}`);

    useEffect(() => {
        const fetchHealthConditionsListData = async () => {
            const resp = await getHealthConditions();
            if (resp) {
                healthConditionsDataRef.current = [...resp];
                setIsLoadingHealthConditions(false);
            }
        };
        if (!healthConditionsDataRef.current) {
            fetchHealthConditionsListData();
        }
    }, []);

    const pageSize = 10;

    useEffect(() => {
        const pagedStart = (currentPage - 1) * pageSize;
        const pageLimit = pageSize * currentPage;
        const slicedResults = [...finalExpensePlans]?.slice(pagedStart, pageLimit);
        setPagedResults(slicedResults);
        scrollTop();
    }, [finalExpensePlans, currentPage, pageSize]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const { addresses, birthdate, gender, weight, height, isTobaccoUser } = leadDetails;
                if (!addresses?.[0]?.stateCode || !birthdate) return;
                setIsLoadingFinalExpensePlans(true);
                const covType = Array.isArray(coverageType) ? coverageType : [coverageType];
                const age = getAgeFromBirthDate(birthdate);
                const todayDate = formatDate(new Date(), "yyyy-MM-dd");
                const code = sessionStorage.getItem(contactId)
                    ? JSON.parse(sessionStorage.getItem(contactId)).stateCode
                    : addresses[0]?.stateCode;

                const conditions = [];
                if (!healthConditionsDataRef.current || healthConditionsDataRef.current.length === 0) {
                    conditions.push({ categoryId: 0, lastTreatmentDate: todayDate });
                } else {
                    healthConditionsDataRef.current.forEach((condition) => {
                        conditions.push({
                            categoryId: condition.conditionId,
                            lastTreatmentDate: condition.lastTreatmentDate
                                ? formatServerDate(condition.lastTreatmentDate)
                                : todayDate,
                        });
                    });
                }
                const quotePlansPostBody = {
                    usState: code,
                    age: Number(age),
                    gender: gender === "Male" ? "M" : "F",
                    tobacco: Boolean(isTobaccoUser),
                    desiredFaceValue: selectedTab === COVERAGE_AMOUNT ? Number(coverageAmount) : null,
                    desiredMonthlyRate: selectedTab === COVERAGE_AMOUNT ? null : Number(monthlyPremium),
                    coverageTypes: covType || [COVERAGE_TYPE[0].value],
                    effectiveDate: todayDate,
                    underWriting: {
                        user: { height: height || 0, weight: weight || 0 },
                        conditions,
                    },
                };

                const result = await getFinalExpenseQuotePlans(quotePlansPostBody);
                setIsLoadingFinalExpensePlans(false);
                setFinalExpensePlans(result?.eligibleSorted || []);
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };
        if (!isLoadingHealthConditions) {
            fetchPlans();
        }
    }, [
        leadDetails,
        isLoadingHealthConditions,
        selectedTab,
        coverageType,
        coverageAmount,
        monthlyPremium,
        getFinalExpenseQuotePlans,
    ]);

    const loadersCards = useMemo(() => {
        const loaders = Array.from({ length: 10 }, (_, i) => <PlanCardLoader key={i} />);
        return <div className={styles.loadersContainer}>{loaders}</div>;
    }, []);

    return (
        <>
            <Media
                query={"(max-width: 1130px)"}
                onChange={(isMobile) => {
                    setIsMobile(isMobile);
                }}
            />
            <div className={styles.planContainer}>
                <PersonalisedQuoteBox />
                {!isLoadingFinalExpensePlans &&
                    pagedResults.map((plan, index) => {
                        const {
                            carrier: { name, logoUrl },
                            coverageType,
                            faceValue,
                            modalRates,
                            policyFee,
                        } = plan;
                        const monthlyRate = modalRates.find((rate) => rate.type === "month")?.rate || 0;
                        return (
                            <PlanCard
                                key={`${name}-${index}`}
                                isMobile={isMobile}
                                planName={name}
                                logoUrl={logoUrl}
                                coverageType={coverageType}
                                coverageAmount={faceValue}
                                monthlyPremium={monthlyRate}
                                policyFee={policyFee}
                            />
                        );
                    })}
                {isLoadingFinalExpensePlans && loadersCards}
                <BackToTop />
                <Pagination
                    currentPage={currentPage}
                    resultName="plans"
                    totalPages={Math.ceil(finalExpensePlans.length / 10)}
                    totalResults={finalExpensePlans.length}
                    pageSize={pageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </>
    );
};

PlanDetailsContainer.propTypes = {
    selectedTab: PropTypes.string.isRequired,
    coverageType: PropTypes.string.isRequired,
    coverageAmount: PropTypes.string.isRequired,
    monthlyPremium: PropTypes.string.isRequired,
};
