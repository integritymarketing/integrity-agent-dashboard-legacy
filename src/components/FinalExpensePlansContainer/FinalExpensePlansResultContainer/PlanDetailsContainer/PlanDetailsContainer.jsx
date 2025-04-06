/* eslint-disable max-lines-per-function */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Media from 'react-media';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import PropTypes from 'prop-types';
import { useFinalExpensePlans } from 'providers/FinalExpense';

import { formatDate, formatServerDate, getAgeFromBirthDate } from 'utils/dates';
import { scrollTop } from 'utils/shared-utils/sharedUtility';

import useAnalytics from 'hooks/useAnalytics';

import { Button } from 'components/ui/Button';

import {
  COVERAGE_AMOUNT,
  COVERAGE_TYPE_FINALOPTION,
  FETCH_PLANS_ERROR,
  MONTHLY_PREMIUM,
  NO_PLANS_ERROR,
  SIMPLIFIED_IUL_NO_RTS_FETCH_PLANS_ERROR,
} from 'components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants';

import {
  COVERAGE_TYPE,
  STEPPER_FILTER,
  STEPPER_FILTER_SIMPLIFIED_IUL,
} from '../FinalExpensePlansResultContainer.constants';
import { AlertIcon } from 'components/icons/alertIcon';
import { BackToTop } from 'components/ui/BackToTop';
import PlanCardLoader from 'components/ui/PlanCard/loader';

import { useLeadDetails } from 'providers/ContactDetails';

import { PlanCard } from './PlanCard';
import useFinalExpenseErrorMessage, {
  ERROR_5,
} from './hooks/useFinalExpenseErrorMessage';

import PersonalisedQuoteBox from '../PersonalisedQuoteBox/PersonalisedQuoteBox';

import styles from './PlanDetailsContainer.module.scss';

import {
  ACTIVE_SELLING_PERMISSIONS_REQUIRED,
  VIEW_SELLING_PERMISSIONS,
} from './PlanDetailsContainer.constants';

import ArrowRightIcon from 'components/icons/arrowRightLight';
import { useCreateNewQuote } from '../../../../providers/CreateNewQuote';
import { PaginationBar } from '@integritymarketing/clients-ui-kit';

export const PlanDetailsContainer = ({
  selectedTab,
  coverageType,
  rateClasses,
  coverageAmount,
  monthlyPremium,
  isShowExcludedProducts,
  isMyAppointedProducts,
  isRTS,
  setIsRTS,
  handleMyAppointedProductsCheck,
  handleIsShowExcludedProductsCheck,
  isShowAlternativeProducts,
  handleIsShowAlternativeProductsCheck,
  healthConditions,
  isLoadingHealthConditions,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [pagedResults, setPagedResults] = useState([]);
  const firstPage = 1;
  const [currentPage, setCurrentPage] = useState(firstPage);
  const { contactId } = useParams();
  const { fireEvent } = useAnalytics();

  const [finalExpenseQuoteAPIResponse, setFinalExpenseQuoteAPIResponse] =
    useState([]);
  const [finalExpensePlans, setFinalExpensePlans] = useState([]);
  const { getFinalExpenseQuotePlans } = useFinalExpensePlans();
  const { isSimplifiedIUL } = useCreateNewQuote();

  const [isLoadingFinalExpensePlans, setIsLoadingFinalExpensePlans] =
    useState(false);
  const { leadDetails } = useLeadDetails();
  const [fetchPlansError, setFetchPlansError] = useState(false);
  const initialRender = useRef(true);
  const [hasNoIULPlansAvailable, setHasNoIULPlansAvailable] = useState(false);
  const [rtsPlans, setRtsPlans] = useState([]);
  const [rtsPlansWithExclusions, setRtsPlansWithExclusions] = useState([]);
  const [showAlternativeProductsMessage, setShowAlternativeProductsMessage] =
    useState(false);

  const noPlanResults = pagedResults.length === 0;

  const { updateErrorMessage, errorMessage, actionLink } =
    useFinalExpenseErrorMessage(
      handleMyAppointedProductsCheck,
      handleIsShowExcludedProductsCheck,
      handleIsShowAlternativeProductsCheck
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
    const { addresses, birthdate, gender, weight, height, isTobaccoUser, age } =
      leadDetails;
    const code = getStateCode(contactId, addresses);

    if (!code || (!birthdate && !age)) {
      return;
    }

    const covType = getCoverageType(coverageType);
    const ageValue = age ? age : getAgeFromBirthDate(birthdate);
    const todayDate = formatDate(new Date(), 'yyyy-MM-dd');
    const { conditions, questions } = getHealthConditionsData(healthConditions);

    const userHeight = weight && height ? height : null;
    const userWeight = weight && height ? weight : null;

    const quotePlansPostBody = buildQuotePlansPostBody({
      code,
      age: ageValue,
      gender,
      isTobaccoUser,
      covType,
      todayDate,
      userHeight,
      userWeight,
      conditions,
      questions,
    });

    try {
      const result = await getFinalExpenseQuotePlans(
        quotePlansPostBody,
        contactId
      );
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
    updateErrorMessage,
    isSimplifiedIUL,
    rateClasses,
    healthConditions,
  ]);

  const getStateCode = (contactId, addresses) => {
    return sessionStorage.getItem(contactId)
      ? JSON.parse(sessionStorage.getItem(contactId)).stateCode
      : addresses[0]?.stateCode;
  };

  const getCoverageType = coverageType => {
    return coverageType === 'Best Available'
      ? COVERAGE_TYPE_FINALOPTION
      : [coverageType];
  };

  const getHealthConditionsData = healthConditionsData => {
    const conditions = [];
    const questions = [];

    if (!healthConditionsData || healthConditionsData.length === 0) {
      return { conditions, questions };
    }

    healthConditionsData.forEach(
      ({
        conditionId,
        lastTreatmentDate,
        underwritingQuestionsAnswers,
        areUwQuestionsComplete,
      }) => {
        if (areUwQuestionsComplete) {
          conditions.push({
            categoryId: conditionId,
            lastTreatmentDate: lastTreatmentDate
              ? formatServerDate(lastTreatmentDate)
              : null,
          });

          if (underwritingQuestionsAnswers) {
            underwritingQuestionsAnswers.forEach(({ questionId, answers }) => {
              answers.forEach(answer => {
                questions.push({
                  questionId,
                  categoryId: conditionId,
                  response: answer.responseAnswerValue,
                });
              });
            });
          }
        }
      }
    );

    return { conditions, questions };
  };

  const buildQuotePlansPostBody = ({
    code,
    age,
    gender,
    isTobaccoUser,
    covType,
    todayDate,
    userHeight,
    userWeight,
    conditions,
    questions,
  }) => {
    const quotePlansPostBody = {
      usState: code,
      age: Number(age),
      gender: gender.toLowerCase() === 'male' ? 'M' : 'F',
      tobacco: Boolean(isTobaccoUser),
      desiredFaceValue:
        selectedTab === COVERAGE_AMOUNT ? Number(coverageAmount) : null,
      desiredMonthlyRate:
        selectedTab === COVERAGE_AMOUNT ? null : Number(monthlyPremium),
      coverageTypes: isSimplifiedIUL()
        ? ['SIMPLIFIED_IUL']
        : covType || [COVERAGE_TYPE[4].value],
      effectiveDate: todayDate,
      underWriting: {
        user: { height: userHeight, weight: userWeight },
        conditions,
        questions,
      },
    };

    if (!isSimplifiedIUL()) {
      quotePlansPostBody.rateClasses = rateClasses?.map(rate =>
        rate === 'Sub Standard' ? 'Sub-Standard' : rate
      ) || ['Standard'];
    }

    if (isSimplifiedIUL()) {
      quotePlansPostBody.showOnlyExcludedProducts =
        !isMyAppointedProducts || isShowExcludedProducts;
    }

    return quotePlansPostBody;
  };

  const setFinalExpensePlansFromResult = useCallback(
    result => {
      if (isSimplifiedIUL()) {
        handleIULPlans(result);
      }

      handleRTSMessage(result);

      updateErrorMessage(
        result,
        isMyAppointedProducts,
        isShowExcludedProducts,
        isShowAlternativeProducts
      );

      if (!isRTS) {
        setNonRTSPlans(result);
      } else {
        setRTSPlans(result);
      }
    },
    [
      isMyAppointedProducts,
      isRTS,
      isShowExcludedProducts,
      isSimplifiedIUL,
      isShowAlternativeProducts,
    ]
  );

  // Helper function for IUL plans handling
  const handleIULPlans = result => {
    if (result?.hasNoIULPlansAvailable) {
      setHasNoIULPlansAvailable(true);
    } else {
      setHasNoIULPlansAvailable(false);
    }

    if (isMyAppointedProducts && !isShowExcludedProducts) {
      setRtsPlans(result?.rtsPlans || []);
    } else if (
      isMyAppointedProducts &&
      !isShowExcludedProducts &&
      result?.alternativePlans
    ) {
      setRtsPlans(result?.alternativePlans || []);
    } else {
      setRtsPlans([]);
    }

    setRtsPlansWithExclusions(result?.rtsPlansWithExclusions || []);
  };

  // Helper function to handle RTS message visibility
  const handleRTSMessage = result => {
    if (
      isMyAppointedProducts &&
      !isShowExcludedProducts &&
      result?.rtsPlans?.length === 0 &&
      result?.alternativePlans?.length > 0
    ) {
      setShowAlternativeProductsMessage(true);
    } else {
      setShowAlternativeProductsMessage(false);
    }
  };

  // Helper function to set non-RTS plans
  const setNonRTSPlans = result => {
    if (isShowExcludedProducts) {
      setFinalExpensePlans(result?.nonRTSPlansWithExclusions); // ShowExcludedProducts true
    } else {
      setFinalExpensePlans(result?.nonRTSPlans); // ShowExcludedProducts false
    }
  };

  // Helper function to set RTS plans based on various conditions
  const setRTSPlans = result => {
    if (isShowAlternativeProducts) {
      setFinalExpensePlans(result?.alternativePlans); // Show Alternative Products
    } else if (isMyAppointedProducts && isShowExcludedProducts) {
      setFinalExpensePlans(result?.rtsPlansWithExclusions); // Condition 1
    } else if (!isMyAppointedProducts && !isShowExcludedProducts) {
      setFinalExpensePlans(result?.nonRTSPlans); // Condition 2
    } else if (isMyAppointedProducts && !isShowExcludedProducts) {
      setFinalExpensePlans(result?.rtsPlans); // Condition 3
    } else if (!isMyAppointedProducts && isShowExcludedProducts) {
      setFinalExpensePlans(result?.nonRTSPlansWithExclusions); // Condition 4
    }
  };

  useEffect(() => {
    setCurrentPage(firstPage);
    setFinalExpensePlansFromResult(finalExpenseQuoteAPIResponse);
  }, [
    isShowExcludedProducts,
    isMyAppointedProducts,
    isShowAlternativeProducts,
    finalExpenseQuoteAPIResponse,
    isRTS,
  ]);

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
      coverageAmount >= covMin &&
      coverageAmount <= covMax &&
      selectedTab === COVERAGE_AMOUNT;
    const monthlyPremiumValue =
      monthlyPremium >= min &&
      monthlyPremium <= max &&
      selectedTab === MONTHLY_PREMIUM;
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
    rateClasses,
    isLoadingHealthConditions,
    leadDetailsData,
    isShowExcludedProducts,
    isMyAppointedProducts,
    isShowAlternativeProducts,
    healthConditions,
  ]);

  const lifeQuoteEvent = eventName => {
    fireEvent(eventName, {
      leadid: contactId,
      line_of_business: 'Life',
      product_type: 'final_expense',
      enabled_filters:
        isShowExcludedProducts && isMyAppointedProducts
          ? ['My Appointed Products', 'Show Excluded Products']
          : isMyAppointedProducts
          ? ['My Appointed Products']
          : isShowExcludedProducts
          ? ['Show Excluded Products']
          : [],
      coverage_vs_premium:
        selectedTab === COVERAGE_AMOUNT ? 'coverage' : 'premium',
      quote_coverage_amount:
        selectedTab === COVERAGE_AMOUNT ? coverageAmount : null,
      quote_monthly_premium:
        selectedTab === MONTHLY_PREMIUM ? monthlyPremium : null,
      quote_coverage_type: coverageType?.toLowerCase(),
      number_of_conditions: healthConditions?.length,
      number_of_completed_condtions:
        healthConditions?.filter(item => item.isComplete)?.length || 0,
    });
  };

  useEffect(() => {
    if (isLoadingHealthConditions) {
      return;
    }
    lifeQuoteEvent('Life Quote Results Viewed');
  }, [healthConditions, isLoadingHealthConditions]);

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
      lifeQuoteEvent('Life Quote Results Updated');
    }
  }, [
    selectedTab,
    coverageType,
    coverageAmount,
    monthlyPremium,
    isShowExcludedProducts,
    isMyAppointedProducts,
    isShowAlternativeProducts,
    healthConditions,
  ]);

  const loadersCards = useMemo(() => {
    const loaders = Array.from({ length: 10 }, (_, i) => (
      <PlanCardLoader key={i} />
    ));
    return <div className={styles.loadersContainer}>{loaders}</div>;
  }, []);

  const renderNoPlansMessage = useCallback(() => {
    // Case 1: No available RTS plans for Simplified IUL
    if (isSimplifiedIUL() && hasNoIULPlansAvailable) {
      if (rtsPlans.length === 0 && noPlanResults) {
        return renderAlertMessage(SIMPLIFIED_IUL_NO_RTS_FETCH_PLANS_ERROR, [
          {
            text: 'Edit Quote Details',
            callbackFunc: () => navigate(`/simplified-iul/create/${contactId}`),
          },
          {
            text: 'Show Excluded Products',
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
            text: 'View available products',
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
      const plansErrorMessage = fetchPlansError
        ? NO_PLANS_ERROR
        : FETCH_PLANS_ERROR;
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

  const renderAlertMessage = (message, actions) => (
    <Box className={styles.noPlans}>
      <Box display='flex' gap='10px' alignItems='center'>
        <Box className={styles.alertIcon}>
          <AlertIcon />
        </Box>
        <Box>{message}</Box>
      </Box>
      {actions?.length
        ? actions?.map((_actionLink, index) => (
            <Box
              key={index}
              onClick={_actionLink?.callbackFunc}
              className={styles.link}
            >
              {_actionLink?.text}
            </Box>
          ))
        : ''}
    </Box>
  );

  const redirectToSelfAttestedPermissions = () => {
    window.location.href = `${
      import.meta.env.VITE_AUTH_PAW_REDIRECT_URI
    }/selling-permissions`;
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
            type='primary'
            icon={<ArrowRightIcon />}
            iconPosition='right'
          />
        </div>
      );
    }
    return null;
  }, [isRTS, navigate, isMyAppointedProducts, noPlanResults]);

  return (
    <>
      <Media
        query={'(max-width: 1130px)'}
        onChange={value => {
          setIsMobile(value);
        }}
      />
      <div
        className={`${styles.planContainer} ${
          noPlanResults ? styles.alignCenter : ''
        }`}
      >
        {isLoadingFinalExpensePlans && loadersCards}
        {!isLoadingFinalExpensePlans && (
          <>
            {<PersonalisedQuoteBox />}
            {renderActiveSellingPermissionsSection()}
            {!isLoadingHealthConditions &&
              !isLoadingFinalExpensePlans &&
              showAlternativeProductsMessage && (
                <>
                  {renderAlertMessage(ERROR_5, [
                    {
                      text: 'Show Alternative Policies',
                      callbackFunc: () =>
                        handleIsShowAlternativeProductsCheck(true),
                    },
                  ])}
                </>
              )}
            {renderNoPlansMessage()}
          </>
        )}

        {pagedResults.length > 0 &&
          ((hasNoIULPlansAvailable && !rtsPlans.length) ||
            !hasNoIULPlansAvailable) &&
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
                  coverageType: apiCoverageType = '',
                  faceValue = '',
                  modalRates = [],
                  eligibility = {},
                  reason = {},
                  type = '',
                  writingAgentNumber = '',
                  isRTS: isRTSPlan = false,
                  policyFee = 0,
                  uwType = '',
                } = plan || {};

                let conditionList = [];
                if (reason?.categoryReasons?.length > 0) {
                  conditionList = reason?.categoryReasons?.map(
                    ({ categoryId, lookBackPeriod }) => {
                      const condition = healthConditions?.find(
                        item => item.conditionId == categoryId
                      );
                      if (condition) {
                        return {
                          name: condition?.conditionName,
                          lookBackPeriod,
                        };
                      }
                    }
                  );
                }

                const formatRate = rate => {
                  if (rate === null || rate === undefined || rate === '') {
                    return 'N/A';
                  }
                  if (rate === 0) {
                    return '0.00';
                  }
                  return rate.toLocaleString();
                };
                const monthlyRate =
                  Array.isArray(modalRates) && modalRates.length > 0
                    ? formatRate(
                        parseFloat(
                          modalRates.find(rate => rate?.type === 'month')
                            ?.totalPremium || '0'
                        ).toFixed(2)
                      )
                    : 'N/A';

                const productMonthlyPremium =
                  Array.isArray(modalRates) && modalRates.length > 0
                    ? formatRate(
                        parseFloat(
                          modalRates.find(rate => rate?.type === 'month')
                            ?.rate || '0'
                        )
                      )
                    : 'N/A';

                const formattedCoverageAmount =
                  faceValue === null ||
                  faceValue === undefined ||
                  faceValue === ''
                    ? 'N/A'
                    : formatRate(parseFloat(faceValue));
                return (
                  <PlanCard
                    key={`${name}-${index}`}
                    isMobile={isMobile}
                    planName={name}
                    benefits={benefits}
                    logoUrl={logoUrl}
                    coverageType={apiCoverageType}
                    coverageAmount={formattedCoverageAmount}
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
                    healthConditions={healthConditions}
                    productMonthlyPremium={productMonthlyPremium}
                    policyFee={policyFee}
                    uwType={uwType}
                    selectedCoverageType={coverageType}
                    isFeatured={isFeatured}
                  />
                );
              })}
              <BackToTop />

              <PaginationBar
                totalCount={finalExpensePlans?.length}
                currentPage={currentPage}
                itemsPerPage={pageSize}
                onChange={page => setCurrentPage(page)}
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
  isShowAlternativeProducts: PropTypes.bool.isRequired,
  handleIsShowAlternativeProductsCheck: PropTypes.func.isRequired,
  rateClasses: PropTypes.shape({
    map: PropTypes.func,
  }),
};
