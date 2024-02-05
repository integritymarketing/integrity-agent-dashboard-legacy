import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Media from "react-media";
import { useParams, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import { useFinalExpensePlans } from "providers/FinalExpense";

import { formatDate, formatServerDate, getAgeFromBirthDate } from "utils/dates";
import { scrollTop } from "utils/shared-utils/sharedUtility";

import useAnalytics from "hooks/useAnalytics";
import useFetch from "hooks/useFetch";

import { Button } from "components/ui/Button";

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

import { useLeadDetails } from "providers/ContactDetails";

import { PlanCard } from "./PlanCard";
import styles from "./PlanDetailsContainer.module.scss";

import PersonalisedQuoteBox from "../PersonalisedQuoteBox/PersonalisedQuoteBox";

import { ACTIVE_SELLING_PERMISSIONS_REQUIRED, VIEW_SELLING_PERMISSIONS } from "./PlanDetailsContainer.constants";

import ArrowRightIcon from "components/icons/arrowRightLight";

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
    const { fireEvent } = useAnalytics();
    const healthConditionsDataRef = useRef(null);
    const [finalExpensePlans, setFinalExpensePlans] = useState([]);
    const { getFinalExpenseQuotePlans, getCarriersInfo, carrierInfo } = useFinalExpensePlans();
    const [isLoadingHealthConditions, setIsLoadingHealthConditions] = useState(true);
    const [isLoadingFinalExpensePlans, setIsLoadingFinalExpensePlans] = useState(false);
    const { leadDetails } = useLeadDetails();
    const [fetchPlansError, setFetchPlansError] = useState(false);

    const { Get: getHealthConditions } = useFetch(`${HEALTH_CONDITION_API}${contactId}`);

    const navigate = useNavigate();

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
                if (!code || !birthdate) {
                    return;
                }
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
                        setFinalExpensePlans(result?.nonRTSPlansWithExclusions); // ShowExcludedProducts true
                    } else {
                        setFinalExpensePlans(result?.nonRTSPlans); // ShowExcludedProducts false
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
        leadDetails,
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

    useEffect(() => {
        fireEvent("Life Quote Results Viewed", {
            leadid: contactId,
            flow: "final_expense",
            line_of_business: "Life",
            product_type: "final_expense",
            enabled_filters: [],
            coverage_vs_premium: selectedTab,
            coverage_amount: coverageAmount,
            premium_amount: monthlyPremium,
            coverage_type_selected: coverageType,
            number_of_conditions: healthConditionsDataRef.current?.length,
            number_of_completed_condtions: healthConditionsDataRef.current?.filter((item) => item.lastTreatmentDate)
                .length,
        });
    }, []);

    const loadersCards = useMemo(() => {
        const loaders = Array.from({ length: 10 }, (_, i) => <PlanCardLoader key={i} />);
        return <div className={styles.loadersContainer}>{loaders}</div>;
    }, []);

    const renderNoPlansMessage = useCallback(() => {
        if (!isLoadingFinalExpensePlans && pagedResults.length === 0) {
            return (
                <div className={styles.noPlans}>
                    <div className={styles.alertIcon}>
                        <AlertIcon />
                    </div>
                    <div>{fetchPlansError ? NO_PLANS_ERROR : FETCH_PLANS_ERROR}</div>
                </div>
            );
        }
        return null;
    }, [isLoadingFinalExpensePlans, pagedResults.length, fetchPlansError]);

    const renderActiveSellingPermissionsSection = useCallback(() => {
        if (!isRTS || !isMyAppointedProducts) {
            return (
                <div className={styles.activeSellingPermissionsRequired}>
                    <p>{ACTIVE_SELLING_PERMISSIONS_REQUIRED}</p>
                    <Button
                        label={VIEW_SELLING_PERMISSIONS}
                        className={styles.viewSellingPermissions}
                        onClick={() => navigate(`/account/selfAttestedPermissions`)}
                        type="primary"
                        icon={<ArrowRightIcon />}
                        iconPosition="right"
                    />
                </div>
            );
        }
        return null;
    }, [isRTS, navigate, isMyAppointedProducts]);

    const hasCarrierInfo = useMemo(() => {
        return carrierInfo?.length > 0;
    }, [carrierInfo]);

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
                {renderNoPlansMessage()}
                <PersonalisedQuoteBox />
                {renderActiveSellingPermissionsSection()}
                {pagedResults.length > 0 && !isLoadingFinalExpensePlans && (
                    <>
                        {pagedResults.map((plan, index) => {
                            const {
                                carrier: { logoUrl, naic, resource_url },
                                product: { name, benefits },
                                coverageType,
                                faceValue,
                                modalRates,
                                eligibility,
                                reason,
                                writingAgentNumber,
                                isRTS: isRTSPlan,
                            } = plan;
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
                            const formatRate = (rate) => {
                                return rate.toFixed(2);
                            };
                            const monthlyRate = formatRate(
                                parseFloat(modalRates.find((rate) => rate.type === "month")?.totalPremium || 0)
                            );
                            return (
                                <PlanCard
                                    key={`${name}-${index}`}
                                    isMobile={isMobile}
                                    planName={name}
                                    benefits={benefits}
                                    logoUrl={logoUrl}
                                    coverageType={coverageType}
                                    coverageAmount={faceValue}
                                    monthlyPremium={monthlyRate}
                                    eligibility={eligibility}
                                    conditionList={conditionList}
                                    isRTSPlan={isRTSPlan}
                                    naic={naic}
                                    contactId={contactId}
                                    resource_url={resource_url}
                                    writingAgentNumber={writingAgentNumber}
                                    isHaveCarriers={hasCarrierInfo}
                                    selectedTab={selectedTab}
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