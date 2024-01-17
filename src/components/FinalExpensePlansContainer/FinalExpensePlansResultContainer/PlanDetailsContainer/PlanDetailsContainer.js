import React, { useEffect, useMemo, useRef, useState } from "react";
import Media from "react-media";
import { useParams } from "react-router-dom";

import PropTypes from "prop-types";
import { useLeadDetails } from "providers/ContactDetails";
import { useFinalExpensePlans } from "providers/FinalExpense";

import { formatDate, formatServerDate, getAgeFromBirthDate } from "utils/dates";
import { scrollTop } from "utils/shared-utils/sharedUtility";

import useFetch from "hooks/useFetch";

import { HEALTH_CONDITION_API } from "components/FinalExpenseHealthConditionsContainer/FinalExpenseHealthConditionsContainer.constants";
import {
    COVERAGE_AMOUNT,
    COVERAGE_TYPE,
    COVERAGE_TYPE_FINALOPTION,
    FETCH_PLANS_ERROR,
    MONTHLY_PREMIUM,
    NO_PLANS_ERROR,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";
import { AlertIcon } from "components/icons/alertIcon";
import { BackToTop } from "components/ui/BackToTop";
import Pagination from "components/ui/Pagination/pagination";
import PlanCardLoader from "components/ui/PlanCard/loader";

import useContactDetails from "pages/ContactDetails/useContactDetails";

import { PlanCard } from "./PlanCard";
import styles from "./PlanDetailsContainer.module.scss";

import PersonalisedQuoteBox from "../PersonalisedQuoteBox/PersonalisedQuoteBox";

export const PlanDetailsContainer = ({
    selectedTab,
    coverageType,
    coverageAmount,
    monthlyPremium,
    isShowExcludedProducts,
    isMyAppointedProducts,
    isRTS,
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [pagedResults, setPagedResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { contactId } = useParams();
    const healthConditionsDataRef = useRef(null);
    const [finalExpensePlans, setFinalExpensePlans] = useState([]);
    const { getFinalExpenseQuotePlans, getCarriersInfo, carrierInfo } = useFinalExpensePlans();
    const [isLoadingHealthConditions, setIsLoadingHealthConditions] = useState(true);
    const [isLoadingFinalExpensePlans, setIsLoadingFinalExpensePlans] = useState(false);
    const [fetchPlansError, setFetchPlansError] = useState(false);

    const { leadDetails, getLeadDetails } = useLeadDetails();

    const { Get: getHealthConditions } = useFetch(`${HEALTH_CONDITION_API}${contactId}`);

    useEffect(() => {
        if (!leadDetails?.firstName) {
            getLeadDetails(contactId);
        }
    }, [contactId, getLeadDetails]);

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
    }, [contactId]);

    useEffect(() => {
        getCarriersInfo();
    }, []);

    const pageSize = 10;

    useEffect(() => {
        if (finalExpensePlans?.length > 0) {
            const pagedStart = (currentPage - 1) * pageSize;
            const pageLimit = pageSize * currentPage;
            const slicedResults = [...finalExpensePlans]?.slice(pagedStart, pageLimit);
            setPagedResults(slicedResults);
            scrollTop();
        } else {
            setPagedResults([]);
        }
    }, [finalExpensePlans, currentPage, pageSize]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setFetchPlansError(false);
                const { addresses, birthdate, gender, weight, height, isTobaccoUser } = leadDetails;
                const code = sessionStorage.getItem(contactId)
                    ? JSON.parse(sessionStorage.getItem(contactId)).stateCode
                    : addresses[0]?.stateCode;
                if (!code || !birthdate) return;
                setIsLoadingFinalExpensePlans(true);
                const covType = coverageType === "Standard Final Expense" ? COVERAGE_TYPE_FINALOPTION : [coverageType];
                const age = getAgeFromBirthDate(birthdate);
                const todayDate = formatDate(new Date(), "yyyy-MM-dd");
                const conditions = [];
                const healthConditions = healthConditionsDataRef.current;

                if (!healthConditions || healthConditions.length === 0) {
                    conditions.push({ categoryId: 0, lastTreatmentDate: null });
                } else {
                    healthConditions.forEach(({ conditionId, lastTreatmentDate }) => {
                        conditions.push({
                            categoryId: conditionId,
                            lastTreatmentDate: lastTreatmentDate ? formatServerDate(lastTreatmentDate) : null,
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
                    coverageTypes: covType || [COVERAGE_TYPE[4].value],
                    effectiveDate: todayDate,
                    underWriting: {
                        user: { height: height || 0, weight: weight || 0 },
                        conditions,
                    },
                };

                const result = await getFinalExpenseQuotePlans(quotePlansPostBody);
                setIsLoadingFinalExpensePlans(false);

                if (!isRTS) {
                    if (isShowExcludedProducts) {
                        setFinalExpensePlans(result?.nonRTSPlans); // ShowExcludedProducts true
                    } else {
                        setFinalExpensePlans(result?.nonRTSPlansWithExclusions); // ShowExcludedProducts false
                    }
                }

                // Life RTS Experience (My Appointed Products checked by default)
                if (isRTS) {
                    if (isMyAppointedProducts && isShowExcludedProducts) {
                        setFinalExpensePlans(result?.rtsPlansWithExclusions); // Condition 1
                    } else if (!isMyAppointedProducts && !isShowExcludedProducts) {
                        setFinalExpensePlans(result?.nonRTSPlans); // Condition 2
                    } else if (isMyAppointedProducts && !isShowExcludedProducts) {
                        setFinalExpensePlans(result?.rtsPlans); // Condition 3
                    } else if (!isMyAppointedProducts && isShowExcludedProducts) {
                        setFinalExpensePlans(result?.nonRTSPlansWithExclusions); // Condition 4
                    }
                }
            } catch (error) {
                setIsLoadingFinalExpensePlans(false);
                setFetchPlansError(true);
            }
        };

        const coverageAmountValue =
            coverageAmount >= 1000 && coverageAmount <= 999999 && selectedTab === COVERAGE_AMOUNT;
        const monthlyPremiumValue = monthlyPremium >= 10 && monthlyPremium <= 999 && selectedTab === MONTHLY_PREMIUM;
        if (!isLoadingHealthConditions && (coverageAmountValue || monthlyPremiumValue)) {
            fetchPlans();
        }
    }, [
        // leadDetails,
        isLoadingHealthConditions,
        selectedTab,
        coverageType,
        coverageAmount,
        monthlyPremium,
        getFinalExpenseQuotePlans,
        isMyAppointedProducts,
        isShowExcludedProducts,
        isRTS,
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
                {isLoadingFinalExpensePlans && loadersCards}
                {!isLoadingFinalExpensePlans && pagedResults.length === 0 && (
                    <div className={styles.noPlans}>
                        <div className={styles.alertIcon}>
                            <AlertIcon />
                        </div>
                        <div>{fetchPlansError ? NO_PLANS_ERROR : FETCH_PLANS_ERROR}</div>
                    </div>
                )}
                {pagedResults.length > 0 && !isLoadingFinalExpensePlans && (
                    <>
                        <PersonalisedQuoteBox />
                        {pagedResults.map((plan, index) => {
                            const {
                                carrier,
                                product: { name },
                                coverageType,
                                faceValue,
                                modalRates,
                                policyFee,
                                eligibility,
                                reason,
                                writingAgentNumber,
                                isRTS: isRTSPlan,
                                type

                            } = plan;
                            const { logoUrl = null, naic = null, resource_url = null } = carrier || {};
                            let conditionList = [];
                            if (reason?.categoryReasons?.length > 0) {
                                conditionList = reason?.categoryReasons?.map(({ categoryId, lookBackPeriod }) => {
                                    const condition = healthConditionsDataRef.current.find(
                                        (item) => item.conditionId == categoryId
                                    );
                                    if (condition) {
                                        return { name: condition?.conditionName, lookBackPeriod };
                                    }
                                });
                            }
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
                                    eligibility={eligibility}
                                    conditionList={conditionList}
                                    isRTSPlan={isRTSPlan}
                                    naic={naic}
                                    planType={type}
                                    contactId={contactId}
                                    resource_url={resource_url}
                                    writingAgentNumber={writingAgentNumber}
                                    isHaveCarriers={carrierInfo?.length > 0}
                                />
                            );
                        })}
                        <BackToTop />

                        <Pagination
                            currentPage={currentPage}
                            resultName="plans"
                            totalPages={Math.ceil(finalExpensePlans?.length / 10)}
                            totalResults={finalExpensePlans?.length}
                            pageSize={pageSize}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </>
                )}
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
