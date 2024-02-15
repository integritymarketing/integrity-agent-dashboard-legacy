/* eslint-disable max-lines-per-function */
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
    COVERAGE_TYPE_FINALOPTION,
    FETCH_PLANS_ERROR,
    MONTHLY_PREMIUM,
    NO_PLANS_ERROR,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";

import { COVERAGE_TYPE } from "../FinalExpensePlansResultContainer.constants";
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
    setIsRTS,
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
    const [isLoadingFinalExpensePlans, setIsLoadingFinalExpensePlans] = useState();
    const [conditionsListState, setConditionsListState] = useState([]);
    const { leadDetails } = useLeadDetails();
    const [fetchPlansError, setFetchPlansError] = useState(false);
    const initialRender = useRef(true);
    const noPlanResults = pagedResults.length === 0;
    const { Get: getHealthConditions } = useFetch(`${HEALTH_CONDITION_API}${contactId}`);

    const navigate = useNavigate();

    const fetchPlans = useCallback(async () => {
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
    }, [
        contactId,
        coverageAmount,
        coverageType,
        getFinalExpenseQuotePlans,
        isMyAppointedProducts,
        isRTS,
        isShowExcludedProducts,
        leadDetails,
        monthlyPremium,
        selectedTab,
    ]);

    useEffect(() => {
        const fetchHealthConditionsListData = async () => {
            const resp = await getHealthConditions();
            if (resp) {
                healthConditionsDataRef.current = [...resp];
                setConditionsListState(resp);
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
        const coverageAmountValue =
            coverageAmount >= 1000 && coverageAmount <= 999999 && selectedTab === COVERAGE_AMOUNT;
        const monthlyPremiumValue = monthlyPremium >= 10 && monthlyPremium <= 999 && selectedTab === MONTHLY_PREMIUM;

        if (!isLoadingHealthConditions && (coverageAmountValue || monthlyPremiumValue)) {
            fetchPlans();
        }
    }, [coverageAmount, fetchPlans, isLoadingHealthConditions, monthlyPremium, selectedTab]);

    const lifeQuoteEvent = (eventName) => {
        fireEvent(eventName, {
            leadid: contactId,
            line_of_business: "Life",
            product_type: "final_expense",
            enabled_filters:
                isShowExcludedProducts && isMyAppointedProducts
                    ? ["My Appointed Products", "Show Excluded Products"]
                    : isMyAppointedProducts
                    ? ["My Appointed Products"]
                    : isShowExcludedProducts
                    ? ["Show Excluded Products"]
                    : [],
            coverage_vs_premium: selectedTab === COVERAGE_AMOUNT ? "coverage" : "premium",
            quote_coverage_amount: selectedTab === COVERAGE_AMOUNT ? coverageAmount : null,
            quote_monthly_premium: selectedTab === MONTHLY_PREMIUM ? monthlyPremium : null,
            quote_coverage_type: coverageType?.toLowerCase(),
            number_of_conditions: conditionsListState?.length,
            number_of_completed_condtions: conditionsListState?.filter((item) => item.isComplete)?.length || 0,
        });
    };

    useEffect(() => {
        lifeQuoteEvent("Life Quote Results Viewed");
    }, []);

    useEffect(() => {
        if (initialRender.current) {
            const timer = setTimeout(() => {
                initialRender.current = false;
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (!initialRender.current) {
            lifeQuoteEvent("Life Quote Results Updated");
        }
    }, [
        selectedTab,
        coverageType,
        coverageAmount,
        monthlyPremium,
        isShowExcludedProducts,
        isMyAppointedProducts,
        conditionsListState,
    ]);

    const loadersCards = useMemo(() => {
        const loaders = Array.from({ length: 10 }, (_, i) => <PlanCardLoader key={i} />);
        return <div className={styles.loadersContainer}>{loaders}</div>;
    }, []);

    const renderNoPlansMessage = useCallback(() => {
        if (isLoadingFinalExpensePlans === false && noPlanResults) {
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
    }, [isLoadingFinalExpensePlans, noPlanResults, fetchPlansError]);

    const renderActiveSellingPermissionsSection = useCallback(() => {
        if (!noPlanResults && (!isRTS || !isMyAppointedProducts)) {
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
    }, [isRTS, navigate, isMyAppointedProducts, noPlanResults]);

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
            <div className={`${styles.planContainer} ${noPlanResults ? styles.alignCenter : ""}`}>
                {isLoadingFinalExpensePlans && loadersCards}
                {!noPlanResults && <PersonalisedQuoteBox />}
                {renderActiveSellingPermissionsSection()}
                {renderNoPlansMessage()}
                {pagedResults.length > 0 && !isLoadingFinalExpensePlans && (
                    <>
                        {pagedResults.map((plan, index) => {
                            const {
                                carrier: { logoUrl, naic, resource_url },
                                product: { name, benefits, limits },
                                coverageType: apiCoverageType,
                                faceValue,
                                modalRates,
                                eligibility,
                                reason,
                                type,
                                writingAgentNumber,
                                isRTS: isRTSPlan,
                                policyFee,
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
                            const product_monthly_premium = formatRate(
                                parseFloat(modalRates.find((rate) => rate.type === "month")?.rate || 0)
                            );

                            return (
                                <PlanCard
                                    key={`${name}-${index}`}
                                    isMobile={isMobile}
                                    planName={name}
                                    benefits={benefits}
                                    logoUrl={logoUrl}
                                    coverageType={apiCoverageType}
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
                                    carrierInfo={plan.carrier}
                                    planType={type}
                                    fetchPlans={fetchPlans}
                                    reason={reason}
                                    limits={limits}
                                    setIsRTS={setIsRTS}
                                    isShowExcludedProducts={isShowExcludedProducts}
                                    isMyAppointedProducts={isMyAppointedProducts}
                                    conditionsListState={conditionsListState}
                                    product_monthly_premium={product_monthly_premium}
                                    policyFee={policyFee}
                                    selectedCoverageType={coverageType}
                                />
                            );
                        })}
                        <BackToTop />

                        <Pagination
                            currentPage={currentPage}
                            resultName="products"
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
