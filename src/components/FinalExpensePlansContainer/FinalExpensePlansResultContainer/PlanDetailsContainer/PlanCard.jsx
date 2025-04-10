/* eslint-disable max-lines-per-function */
import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import useAgentInformationByID from 'hooks/useAgentInformationByID';
import { useLeadDetails } from 'providers/ContactDetails';
import useAnalytics from 'hooks/useAnalytics';
import useFetch from 'hooks/useFetch';
import {
  APPLY,
  COVERAGE_AMOUNT,
  COVERAGE_TYPE,
  ENROLLEMENT_SERVICE,
  MONTHLY_PREMIUM,
  PLAN_INFO,
} from 'components/FinalExpensePlansContainer/FinalExpensePlansContainer.constants';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';
import InfoBlue from 'components/icons/version-2/InfoBlue';
import { Button } from 'components/ui/Button';
import { FinalExpenseEnrollResponseModal } from './FinalExpenseEnrollResponseModal';
import styles from './PlanDetailsContainer.module.scss';
import { getPlanEnrollBody } from './PlanDetailsContainer.utils';
import { PrescreenModal } from './PrescreenModal';
import {
  SingleSignOnModal,
  SingleSignOnInitialModal,
} from 'components/FinalExpensePlansContainer/SingleSignOnModal';
import {
  GRADEDMODIFIED,
  GRADED_MODIFIED,
} from './PlanDetailsContainer.constants';
import { convertToTitleCase } from 'utils/toTitleCase';
import Spinner from 'components/ui/Spinner';
import { FinalExpenseErrorModal } from '../../FinalExpenseErrorModal';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import SaveToContact from 'components/QuickerQuote/Common/SaveToContact';

export const PlanCard = ({
  isMobile,
  planName,
  logoUrl,
  resource_url,
  naic,
  coverageType,
  coverageAmount,
  monthlyPremium,
  eligibility,
  conditionList,
  benefits = [],
  writingAgentNumber,
  contactId,
  selectedTab,
  carrierInfo,
  isRTSPlan,
  planType,
  fetchPlans,
  reason,
  limits,
  isShowExcludedProducts,
  isMyAppointedProducts,
  conditionsListState,
  productMonthlyPremium,
  policyFee,
  uwType,
  selectedCoverageType,
  isFeatured,
}) => {
  const [isPrescreenModalOpen, setIsPrescreenModalOpen] = useState(false);
  const [isSingleSignOnModalOpen, setIsSingleSignOnModalOpen] = useState(false);
  const [isSingleSignOnInitialModalOpen, setIsSingleSignOnInitialModalOpen] =
    useState(false);
  const { leadDetails } = useLeadDetails();
  const { fireEvent } = useAnalytics();
  const { agentInformation } = useAgentInformationByID();
  const { agentFirstName, agentLastName } = agentInformation || {};
  const {
    Post: enrollLeadFinalExpensePlan,
    error: enrollLeadFinalExpensePlanError,
  } = useFetch(`${ENROLLEMENT_SERVICE}${contactId}/naic/${naic}`);
  const [enrollResponse, setEnrollResponse] = useState(null);
  const [isLoadingEnroll, setIsLoadingEnroll] = useState(false);
  const [isFinalExpenseErrorModalOpen, setIsFinalExpenseErrorModalOpen] =
    useState(false);
  const [latestWritingAgentNumber, setLatestWritingAgentNumber] =
    useState(null);

  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);

  const { isQuickQuotePage } = useCreateNewQuote();

  useEffect(() => {
    if (isPrescreenModalOpen) {
      lifeQuotePrescreeningEvent('Final Expense Prescreening Notes Viewed');
    }
  }, [isPrescreenModalOpen, contactId]);

  useEffect(() => {
    if (writingAgentNumber) {
      setLatestWritingAgentNumber(writingAgentNumber);
    }
  }, [writingAgentNumber]);

  const lifeQuotePrescreeningEvent = eventName => {
    fireEvent(eventName, {
      leadid: contactId,
      line_of_business: 'Life',
      product_type: 'final_expense',
      coverage_vs_premium:
        selectedTab === COVERAGE_AMOUNT ? 'coverage' : 'premium',
      coverage_amount: coverageAmount,
      premium_amount: monthlyPremium,
      coverage_type_selected: coverageType?.toLowerCase(),
      carrier_group: carrierInfo?.parent,
      carrier: carrierInfo?.name,
      pre_screening_status: eligibility,
    });
  };

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
      quote_coverage_type: selectedCoverageType?.toLowerCase(),
      number_of_conditions: conditionsListState?.length,
      number_of_completed_condtions:
        conditionsListState?.filter(item => item.isComplete)?.length || 0,
      carrier_group: carrierInfo?.parent,
      carrier: carrierInfo?.name,
      product_coverage_type: coverageType?.toLowerCase(),
      product_coverage_amount: coverageAmount,
      product_monthly_premium: productMonthlyPremium,
      product_total_monthly_premium: monthlyPremium,
      product_monthly_policy_fee: policyFee,
      pre_screening_status: eligibility,
    });
  };

  const lifeQuoteCallEvent = success => {
    fireEvent('Life SSO Eligibility Call Completed', {
      leadid: contactId,
      line_of_business: 'life',
      product_type: 'final_expense',
      carrier_group: carrierInfo?.parent,
      carrier: carrierInfo?.name,
      success,
    });
  };
  const isPlanExcluded = useMemo(() => {
    return reason != null;
  }, [reason]);

  const onPreApply = async leadData => {
    lifeQuoteEvent('Life Apply CTA Clicked');
    if (!isRTSPlan) {
      setIsSingleSignOnModalOpen(true);
    } else {
      await onApply(null, null, false, leadData);
    }
  };

  const onApply = async (
    producerId,
    onSuccess,
    apiErrorState = false,
    leadData
  ) => {
    try {
      const updatedLeadDetails = leadData || leadDetails;
      let writingAgentNumberToSend = getWritingAgentNumber(
        producerId,
        apiErrorState
      );
      setIsLoadingEnroll(true);
      setLatestWritingAgentNumber(writingAgentNumberToSend);

      const body = getPlanEnrollBody(
        writingAgentNumberToSend,
        agentFirstName,
        agentLastName,
        updatedLeadDetails,
        coverageAmount,
        planName,
        resource_url,
        contactId,
        planType,
        uwType
      );

      const response = await enrollLeadFinalExpensePlan(body);
      setIsLoadingEnroll(false);

      return handleResponse(response, onSuccess);
    } catch (error) {
      setIsLoadingEnroll(false);
      handleError(error);
    }
  };

  const getWritingAgentNumber = (producerId, apiErrorState) => {
    return apiErrorState ? producerId : latestWritingAgentNumber ?? producerId;
  };

  const handleResponse = async (response, onSuccess) => {
    if (!response?.success) {
      if (response?.status === 400) {
        setIsFinalExpenseErrorModalOpen(true);
        return false;
      }
      if (response?.status === 500 || response?.status === 503) {
        setEnrollResponse({ ...response, statusCode: 500 });
        return false;
      }
      setEnrollResponse(true);
      return false;
    }

    if (response?.isSso) {
      lifeQuoteCallEvent(response?.success);
    }

    if (onSuccess) {
      await onSuccess();
    }

    if (response.redirectUrl) {
      window.open(response.redirectUrl, '_blank');
      return true;
    } else {
      setEnrollResponse(response);
      return false;
    }
  };

  const handleError = error => {
    if (error.message) {
      const errorMessage = JSON.parse(error.message);
      if (errorMessage.status === 400) {
        setIsFinalExpenseErrorModalOpen(true);
      }
      if (errorMessage.status === 500) {
        setEnrollResponse({ ...errorMessage, statusCode: 500 });
      }
    }
    console.error('Error applying for quote:', error);
  };

  const renderBenefits = () => (
    <table>
      <thead>
        <tr>
          <th>{PLAN_INFO}</th>
          <th>{benefits[0][0]}</th>
          <th>{benefits[0][1]}</th>
        </tr>
      </thead>
      <tbody>
        {benefits.slice(1).map((benefit, index) => (
          <tr key={index}>
            <td></td>
            <td>{benefit[0]}</td>
            <td>{benefit[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.planBoxWrapper}>
      {isFeatured && (
        <div className={styles.planBoxFeatureHeader}>Featured Product</div>
      )}
      <div className={styles.planBox}>
        <div className={styles.header}>
          <div>{planName}</div>
          {logoUrl && (
            <img src={logoUrl} alt='plan logo' className={styles.logo} />
          )}
        </div>
        <div>
          <span className={styles.label}>{COVERAGE_TYPE}</span>
          <span>
            {coverageType === GRADED_MODIFIED
              ? GRADEDMODIFIED
              : convertToTitleCase(coverageType)}
          </span>
        </div>
        <div
          className={`${styles.additionalInfo} ${
            isMobile ? styles.column : ''
          }`}
        >
          <div className={styles.amountInfo}>
            <div className={styles.coverageAmount}>
              <div>{COVERAGE_AMOUNT}</div>
              <div className={styles.amount}>
                {coverageAmount !== 'N/A' && '$'}
                {coverageAmount}
              </div>
            </div>
            <div className={styles.separator}></div>
            <div>
              <div>{MONTHLY_PREMIUM}</div>
              <div className={styles.amount}>
                {monthlyPremium !== 'N/A' ? (
                  <>
                    ${monthlyPremium}
                    <span className={styles.unit}>/mo</span>
                  </>
                ) : (
                  monthlyPremium
                )}
              </div>
            </div>
          </div>
          {benefits.length > 0 && (
            <>
              <div className={styles.horizSeparator}></div>
              <div className={styles.flex}>{renderBenefits()}</div>
            </>
          )}
        </div>
        {eligibility && (
          <div className={styles.prescreen}>
            <span onClick={() => setIsPrescreenModalOpen(true)}>
              <InfoBlue />
            </span>
            {eligibility}
          </div>
        )}

        <PrescreenModal
          isOpen={isPrescreenModalOpen}
          onClose={() => setIsPrescreenModalOpen(false)}
          eligibility={eligibility}
          conditionList={conditionList}
          reason={reason}
          limits={limits}
        />
        <FinalExpenseEnrollResponseModal
          isOpen={enrollResponse !== null}
          onClose={() => {
            setEnrollResponse(null);
            fetchPlans();
          }}
          enrollResponse={enrollResponse}
        />
        <SingleSignOnInitialModal
          isOpen={isSingleSignOnInitialModalOpen}
          onClose={() => setIsSingleSignOnInitialModalOpen(false)}
          onRetry={() => {
            setIsSingleSignOnInitialModalOpen(false);
            setIsFinalExpenseErrorModalOpen(true);
          }}
        />
        <SingleSignOnModal
          isOpen={isSingleSignOnModalOpen}
          onClose={() => setIsSingleSignOnModalOpen(false)}
          carrierInfo={carrierInfo}
          resourceUrl={resource_url}
          onApply={onApply}
          fetchPlans={fetchPlans}
          setIsSingleSignOnInitialModalOpen={setIsSingleSignOnInitialModalOpen}
        />
        <FinalExpenseErrorModal
          isOpen={isFinalExpenseErrorModalOpen}
          onClose={() => setIsFinalExpenseErrorModalOpen(false)}
          carrierInfo={carrierInfo}
          resourceUrl={resource_url}
          onApply={onApply}
          fetchPlans={fetchPlans}
          writingAgentNumber={latestWritingAgentNumber}
          setIsSingleSignOnInitialModalOpen={setIsSingleSignOnInitialModalOpen}
        />
        {isLoadingEnroll && (
          <div className={styles.spinner}>
            <Spinner />
          </div>
        )}

        <div className={styles.applyCTA}>
          <Button
            label={APPLY}
            disabled={!isRTSPlan || isPlanExcluded}
            onClick={() => {
              if (isQuickQuotePage) {
                setContactSearchModalOpen(true);
              } else {
                onPreApply();
              }
            }}
            type='primary'
            icon={<ButtonCircleArrow />}
            iconPosition='right'
            className={`${styles.applyButton} ${
              isPlanExcluded ? styles.disabled : ''
            }`}
          />
        </div>
        <SaveToContact
          contactSearchModalOpen={contactSearchModalOpen}
          handleClose={() => setContactSearchModalOpen(false)}
          handleCallBack={onPreApply}
          page='finalExpense'
        />
      </div>
    </div>
  );
};

PlanCard.propTypes = {
  isFeatured: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  planName: PropTypes.string.isRequired,
  logoUrl: PropTypes.string.isRequired,
  resource_url: PropTypes.string.isRequired,
  naic: PropTypes.string.isRequired,
  contactId: PropTypes.string.isRequired,
  writingAgentNumber: PropTypes.string.isRequired,
  coverageType: PropTypes.string.isRequired,
  coverageAmount: PropTypes.number, // Updated to be optional
  monthlyPremium: PropTypes.number.isRequired,
  eligibility: PropTypes.string.isRequired,
  benefits: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  selectedTab: PropTypes.string.isRequired,
  carrierInfo: PropTypes.object,
  isRTSPlan: PropTypes.bool,
  planType: PropTypes.string.isRequired,
  fetchPlans: PropTypes.func,
  isShowExcludedProducts: PropTypes.bool,
  isMyAppointedProducts: PropTypes.bool,
  conditionsListState: PropTypes.array,
  productMonthlyPremium: PropTypes.number,
  policyFee: PropTypes.number,
  uwType: PropTypes.string,
  selectedCoverageType: PropTypes.string,
  conditionList: PropTypes.arrayOf(PropTypes.string),
  limits: PropTypes.arrayOf(
    PropTypes.shape({
      maxAge: PropTypes.number,
      maxAmount: PropTypes.number,
      minAge: PropTypes.number,
      minAmount: PropTypes.number,
    })
  ),
  reason: PropTypes.shape({
    MaxAgeExceeded: PropTypes.bool,
    MaxFaceAmountExceeded: PropTypes.bool,
    MinAgeNotMet: PropTypes.bool,
    MinFaceAmountNotMet: PropTypes.bool,
    build: PropTypes.bool,
  }),
};

PlanCard.defaultProps = {
  coverageType: '', // Provide a default null value for coverageAmount
};
