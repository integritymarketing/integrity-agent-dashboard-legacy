/* eslint-disable max-lines-per-function */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Media from "react-media";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";

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
    SIMPLIFIED_IUL_NO_RTS_FETCH_PLANS_ERROR,
} from "components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants";

import {
    COVERAGE_TYPE,
    STEPPER_FILTER,
    STEPPER_FILTER_SIMPLIFIED_IUL,
} from "../FinalExpensePlansResultContainer.constants";
import { AlertIcon } from "components/icons/alertIcon";
import { BackToTop } from "components/ui/BackToTop";
import Pagination from "components/ui/Pagination/pagination";
import PlanCardLoader from "components/ui/PlanCard/loader";

import { useLeadDetails } from "providers/ContactDetails";

import { PlanCard } from "./PlanCard";
import useFinalExpenseErrorMessage, { ERROR_5 } from "./hooks/useFinalExpenseErrorMessage";

import PersonalisedQuoteBox from "../PersonalisedQuoteBox/PersonalisedQuoteBox";

import styles from "./PlanDetailsContainer.module.scss";

import { ACTIVE_SELLING_PERMISSIONS_REQUIRED, VIEW_SELLING_PERMISSIONS } from "./PlanDetailsContainer.constants";

import ArrowRightIcon from "components/icons/arrowRightLight";
import { useCreateNewQuote } from "../../../../providers/CreateNewQuote";

export const PlanDetailsContainer = ({
    selectedTab,
    coverageType,
    coverageAmount,
    monthlyPremium,
    isShowExcludedProducts,
    isMyAppointedProducts,
    isRTS,
    setIsRTS,
    handleMyAppointedProductsCheck,
    handleIsShowExcludedProductsCheck,
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [pagedResults, setPagedResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { contactId } = useParams();
    const { fireEvent } = useAnalytics();
    const healthConditionsDataRef = useRef(null);
    const [finalExpenseQuoteAPIResponse, setFinalExpenseQuoteAPIResponse] = useState([]);
    const [finalExpensePlans, setFinalExpensePlans] = useState([]);
    const { getFinalExpenseQuotePlans } = useFinalExpensePlans();
    const { isSimplifiedIUL } = useCreateNewQuote();
    const [isLoadingHealthConditions, setIsLoadingHealthConditions] = useState(true);
    const [isLoadingFinalExpensePlans, setIsLoadingFinalExpensePlans] = useState(true);
    const [conditionsListState, setConditionsListState] = useState([]);
    const { leadDetails } = useLeadDetails();
    const [fetchPlansError, setFetchPlansError] = useState(false);
    const initialRender = useRef(true);
    const [hasNoIULPlansAvailable, setHasNoIULPlansAvailable] = useState(false);
    const [rtsPlans, setRtsPlans] = useState([]);
    const [rtsPlansWithExclusions, setRtsPlansWithExclusions] = useState([]);

    const noPlanResults = pagedResults.length === 0;
    const { Get: getHealthConditions } = useFetch(`${HEALTH_CONDITION_API}${contactId}`);
    const { updateErrorMesssage, errorMessage, actionLink } = useFinalExpenseErrorMessage(
        handleMyAppointedProductsCheck,
        handleIsShowExcludedProductsCheck,
    );
    const navigate = useNavigate();
    const leadDetailsData = Boolean(leadDetails);

    const stepperFilter = useMemo(() => {
        return isSimplifiedIUL() ? STEPPER_FILTER_SIMPLIFIED_IUL : STEPPER_FILTER;
    }, [isSimplifiedIUL]);

    const { min: covMin, max: covMax } = stepperFilter[COVERAGE_AMOUNT];
    const { min, max } = stepperFilter[MONTHLY_PREMIUM];

    const fetchPlans = useCallback(async () => {
        setFetchPlansError(false);
        setIsLoadingFinalExpensePlans(true);

        const { addresses, birthdate, gender, weight, height, isTobaccoUser } = leadDetails;
        const code = sessionStorage.getItem(contactId)
            ? JSON.parse(sessionStorage.getItem(contactId)).stateCode
            : addresses[0]?.stateCode;
        if (!code || !birthdate) {
            return;
        }
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
            gender: gender.toLowerCase() === "male" ? "M" : "F",
            tobacco: Boolean(isTobaccoUser),
            desiredFaceValue: selectedTab === COVERAGE_AMOUNT ? Number(coverageAmount) : null,
            desiredMonthlyRate: selectedTab === COVERAGE_AMOUNT ? null : Number(monthlyPremium),
            coverageTypes: isSimplifiedIUL() ? ["SIMPLIFIED_IUL"] : covType || [COVERAGE_TYPE[4].value],
            effectiveDate: todayDate,
            underWriting: {
                user: { height: height || 0, weight: weight || 0 },
                conditions,
            },
        };

        if (isSimplifiedIUL()) {
            quotePlansPostBody.showOnlyExcludedProducts = !isMyAppointedProducts || isShowExcludedProducts;
        }

        try {
            const result = await getFinalExpenseQuotePlans(quotePlansPostBody, contactId);
            setFinalExpenseQuoteAPIResponse(result);
        } catch (error) {
            setIsLoadingFinalExpensePlans(false);
            setFetchPlansError(true);
        } finally {
            setIsLoadingFinalExpensePlans(false);
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
        updateErrorMesssage,
        isSimplifiedIUL,
    ]);

    const setFinalExpensePlansFromResult = useCallback(
        (result) => {
            if (isSimplifiedIUL()) {
                if (result?.hasNoIULPlansAvailable) {
                    setHasNoIULPlansAvailable(true);
                } else {
                    setHasNoIULPlansAvailable(false);
                }
                if (isMyAppointedProducts && !isShowExcludedProducts) {
                    setRtsPlans(result?.rtsPlans || []);
                } else {
                    setRtsPlans([]);
                }
                setRtsPlansWithExclusions(result?.rtsPlansWithExclusions || []);
            }

            // Update error message based on business logic
            updateErrorMesssage(result, isMyAppointedProducts, isShowExcludedProducts);

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
        },
        [isMyAppointedProducts, isRTS, isShowExcludedProducts, isSimplifiedIUL],
    );

    useEffect(() => {
        setFinalExpensePlansFromResult(finalExpenseQuoteAPIResponse);
    }, [isShowExcludedProducts, isMyAppointedProducts, finalExpenseQuoteAPIResponse, isRTS]);

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

    const pageSize = 10;

    useEffect(() => {
        if (finalExpensePlans?.length > 0) {
            const pagedStart = (currentPage - 1) * pageSize;
            const pageLimit = pageSize * currentPage;
            const slicedResults = finalExpensePlans.slice(pagedStart, pageLimit);
            setPagedResults(slicedResults);
            scrollTop();
        } else {
            setPagedResults([]);
        }
    }, [finalExpensePlans, currentPage, pageSize]);

    useEffect(() => {
        const coverageAmountValue =
            coverageAmount >= covMin && coverageAmount <= covMax && selectedTab === COVERAGE_AMOUNT;
        const monthlyPremiumValue = monthlyPremium >= min && monthlyPremium <= max && selectedTab === MONTHLY_PREMIUM;
        if (
            (coverageAmountValue || monthlyPremiumValue) &&
            !isLoadingHealthConditions &&
            leadDetailsData &&
            isRTS !== undefined
        ) {
            fetchPlans();
        }
    }, [
        coverageAmount,
        monthlyPremium,
        selectedTab,
        coverageType,
        isLoadingHealthConditions,
        leadDetailsData,
        isShowExcludedProducts,
        isMyAppointedProducts,
    ]);

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
        if (isLoadingHealthConditions) {
            return;
        }
        lifeQuoteEvent("Life Quote Results Viewed");
    }, [conditionsListState, isLoadingHealthConditions]);

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
        // Case 1: No available RTS plans for Simplified IUL
        if (isSimplifiedIUL() && hasNoIULPlansAvailable) {
            if (rtsPlans.length === 0 && noPlanResults) {
                return renderAlertMessage(SIMPLIFIED_IUL_NO_RTS_FETCH_PLANS_ERROR, [
                    {
                        text: "Edit Quote Details",
                        callbackFunc: () => navigate(`/simplified-iul/create/${contactId}`),
                    },
                    {
                        text: "Show Excluded plans",
                        callbackFunc: () => {
                            handleIsShowExcludedProductsCheck(true);
                            handleMyAppointedProductsCheck(true);
                        },
                    },
                ]);
            }

            if (rtsPlans.length) {
                return renderAlertMessage(ERROR_5, [
                    {
                        text: "View available plans",
                        callbackFunc: () => navigate(`/finalexpenses/plans/${contactId}`),
                    },
                ]);
            }
        }

        // Case 2: Error fetching plans or default message
        if (errorMessage) {
            return renderAlertMessage(errorMessage, [actionLink]);
        }

        if (noPlanResults) {
            const plansErrorMessage = fetchPlansError ? NO_PLANS_ERROR : FETCH_PLANS_ERROR;
            return renderAlertMessage(plansErrorMessage, []);
        }

        // Default: No message to display
        return null;
    }, [
        errorMessage,
        noPlanResults,
        fetchPlansError,
        actionLink,
        rtsPlans,
        isShowExcludedProducts,
        isMyAppointedProducts,
        rtsPlansWithExclusions,
    ]);

    const renderAlertMessage = (message, actions = []) => (
        <Box className={styles.noPlans}>
            <Box display="flex" gap="10px">
                <Box className={styles.alertIcon}>
                    <AlertIcon />
                </Box>
                <Box>{message}</Box>
            </Box>
            {actions.length
                ? actions.map((_actionLink, index) => (
                      <Box key={index} onClick={_actionLink.callbackFunc} className={styles.link}>
                          {_actionLink.text}
                      </Box>
                  ))
                : ""}
        </Box>
    );

    const redirectToSelfAttestedPermissions = () => {
        window.location.href = `${process.env.REACT_APP_AUTH_PAW_REDIRECT_URI}/selling-permissions`;
    };

    const renderActiveSellingPermissionsSection = useCallback(() => {
        if (!noPlanResults && (!isRTS || !isMyAppointedProducts)) {
            return (
                <div className={styles.activeSellingPermissionsRequired}>
                    <p>{ACTIVE_SELLING_PERMISSIONS_REQUIRED}</p>
                    <Button
                        label={VIEW_SELLING_PERMISSIONS}
                        className={styles.viewSellingPermissions}
                        onClick={redirectToSelfAttestedPermissions}
                        type="primary"
                        icon={<ArrowRightIcon />}
                        iconPosition="right"
                    />
                </div>
            );
        }
        return null;
    }, [isRTS, navigate, isMyAppointedProducts, noPlanResults]);

    return (
        <>
            <Media
                query={"(max-width: 1130px)"}
                onChange={(value) => {
                    setIsMobile(value);
                }}
            />
            <div className={`${styles.planContainer} ${noPlanResults ? styles.alignCenter : ""}`}>
                {isLoadingFinalExpensePlans && loadersCards}
                {!isLoadingFinalExpensePlans && (
                    <>
                        {<PersonalisedQuoteBox />}
                        {renderActiveSellingPermissionsSection()}
                        {renderNoPlansMessage()}
                    </>
                )}
                {pagedResults.length > 0 &&
                    ((hasNoIULPlansAvailable && !rtsPlans.length) || !hasNoIULPlansAvailable) &&
                    !isLoadingFinalExpensePlans && (
                        <>
                            {pagedResults.map((plan, index) => {
                                // Ensure that carrier and product are not null before destructuring
                                const carrier = plan.carrier || {};
                                const product = plan.product || {};
                                const { logoUrl, naic, resource_url } = carrier;
                                const isFeatured = plan?.isFeatured || false;

                                const { name, benefits, limits } = product;

                                // Ensure other destructured properties are safely accessed
                                const {
                                    coverageType: apiCoverageType = "",
                                    faceValue = "",
                                    modalRates = [],
                                    eligibility = {},
                                    reason = {},
                                    type = "",
                                    writingAgentNumber = "",
                                    isRTS: isRTSPlan = false,
                                    policyFee = 0,
                                    uwType = "",
                                } = plan || {};

                                let conditionList = [];
                                if (reason?.categoryReasons?.length > 0) {
                                    conditionList = reason?.categoryReasons?.map(({ categoryId, lookBackPeriod }) => {
                                        const condition = healthConditionsDataRef.current.find(
                                            (item) => item.conditionId == categoryId,
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
                                    parseFloat(modalRates.find((rate) => rate.type === "month")?.totalPremium || 0),
                                );
                                const product_monthly_premium = formatRate(
                                    parseFloat(modalRates.find((rate) => rate.type === "month")?.rate || 0),
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
                                        uwType={uwType}
                                        selectedCoverageType={coverageType}
                                        isFeatured={isFeatured}
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
    isShowExcludedProducts: PropTypes.bool.isRequired,
    isMyAppointedProducts: PropTypes.bool.isRequired,
    isRTS: PropTypes.bool.isRequired,
    setIsRTS: PropTypes.func.isRequired,
    handleMyAppointedProductsCheck: PropTypes.func.isRequired,
    handleIsShowExcludedProductsCheck: PropTypes.func.isRequired,
};
