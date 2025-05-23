import { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import {
  capitalizeFirstLetter,
  formatUnderScoreString,
} from 'utils/shared-utils/sharedUtility';
import shouldDisableEnrollButtonBasedOnEffectiveDate from 'utils/shouldDisableEnrollButtonBasedOnEffectiveDate';
import useRoles from 'hooks/useRoles';
import Arrow from 'components/icons/down';
import {
  calculateMonthlyDrugCost,
  calculatePartialYearDrugCost,
} from './calculatePartialDrugCost';
import CostBreakdowns from './cost-breakdowns';
import './index.scss';
import PlanCoverage from './plan-coverage/PlanCoverage';
import SelfRecommendation from './self-recommendation/SelfRecommendation';
import useAnalytics from 'hooks/useAnalytics';
import { PLAN_TYPE_ENUMS } from '../../../constants';
import { Button } from '../Button';
import Rating from '../Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight } from '@awesome.me/kit-7ab3488df1/icons/classic/light';

import { usePharmacyContext } from 'providers/PharmacyProvider/usePharmacyContext';
import CommissionableInfo from './commissionableInfo';
import Box from '@mui/material/Box';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const LOGO_BASE_URL =
  'https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/';

const getCoverageRecommendations = planData => {
  if (!planData?.crossUpSellPlanOptions) {
    return false;
  }

  const list = { ...planData?.crossUpSellPlanOptions };
  const coverageArray = [];
  Object.keys(list).map(keyName => {
    if (list[keyName] === '1') {
      const value = keyName.includes('_')
        ? formatUnderScoreString(keyName)
        : capitalizeFirstLetter(keyName);

      coverageArray.push(value);
    }
    return keyName;
  });
  return coverageArray.join(', ');
};

export default function PlanCard({
  contact,
  planData,
  effectiveDate,
  onEnrollClick,
  onDetailsClick,
  isMobile,
  onChangeCompare,
  isChecked,
  isCompareDisabled,
  refresh,
  leadId,
}) {
  const [breakdownCollapsed, setBreakdownCollapsed] = useState(isMobile);

  const { contactId } = useParams();
  const { fireEvent } = useAnalytics();

  const { selectedPharmacy } = usePharmacyContext();

  const {
    logoURL,
    estimatedCostCalculationRxs,
    estimatedMailOrderCostCalculationRx,
  } = planData;

  let selectedPharmacyCosts;

  if (Object.keys(selectedPharmacy).length && selectedPharmacy?.pharmacyId) {
    selectedPharmacyCosts = estimatedCostCalculationRxs?.find(
      rx => rx?.pharmacyId == selectedPharmacy?.pharmacyId
    );
  } else {
    selectedPharmacyCosts = estimatedCostCalculationRxs?.find(
      rx => rx?.isMailOrder
    );
  }

  const mailOrder = estimatedMailOrderCostCalculationRx;

  const checkForImage =
    logoURL && logoURL.match(/.(jpg|jpeg|png|gif)$/i) ? logoURL : false;

  const planType = PLAN_TYPE_ENUMS[planData?.planType];

  const { isNonRTS_User } = useRoles();

  const disableEnroll =
    isNonRTS_User ||
    shouldDisableEnrollButtonBasedOnEffectiveDate(effectiveDate) ||
    (planData?.planType === 2 && planData?.commissionable === false);

  const validatePartialYearDrugCost = calculatePartialYearDrugCost(
    planData?.estimatedAnnualDrugCostPartialYear,
    planData?.drugPremium,
    effectiveDate
  );
  const validatePartialMonthlyDrugCost = calculateMonthlyDrugCost(
    planData?.estimatedAnnualDrugCostPartialYear,
    planData?.drugPremium,
    effectiveDate
  );

  const mailOrderNotApplicable =
    selectedPharmacy?.name === 'Mail Order' &&
    ((planData?.hasMailDrugBenefits &&
      planData?.estimatedAnnualMailOrderDrugCostPartialYear === null) ||
      !planData?.hasMailDrugBenefits);

  return (
    <div className={'plan-card'}>
      <div className={`header ${isMobile ? 'mobile' : ''}`}>
        <div className={'plan-name'}>{planData?.planName} </div>
        {checkForImage && (
          <div className={'plan-logo'}>
            {isMobile && (
              <div className={'rating-container'}>
                <Rating value={planData?.planRating} />
              </div>
            )}
            <img src={LOGO_BASE_URL + logoURL} alt='logo' />{' '}
          </div>
        )}
      </div>
      {planData?.marketingName && !isMobile && (
        <div className={'sub-header'}>
          <div className={'carrier-name cr-name-mbl'}>
            {planData?.marketingName}
          </div>
          {!isMobile && (
            <div className={'rating-container'}>
              <Rating value={planData?.planRating} />
            </div>
          )}
        </div>
      )}
      <div className={`premiums ${isMobile ? 'mobile' : ''}`}>
        <div
          className={`plan-monthly-costs ${
            !breakdownCollapsed && isMobile ? 'plan-ms-open' : ''
          }`}
        >
          <div
            className={'monthly'}
            onClick={() => {
              if (planType === 'MA' && isMobile) {
                return setBreakdownCollapsed(isMobile && !breakdownCollapsed);
              } else {
                return false;
              }
            }}
          >
            <div className={'label'}>Monthly Plan Premium</div>
            <div className={'currency'}>
              {currencyFormatter.format(
                Number(selectedPharmacyCosts?.monthlyPlanPremium).toFixed(2)
              )}
            </div>
          </div>

          {planType !== 'MA' && (
            <div
              className={' rx-drug'}
              onClick={() => {
                setBreakdownCollapsed(isMobile && !breakdownCollapsed);
              }}
            >
              <div>
                <div className={'label'}>Est. Monthly RX Drug Cost</div>
                <div className={'currency'}>
                  {validatePartialMonthlyDrugCost === 'N/A'
                    ? 'N/A'
                    : currencyFormatter.format(
                        Number(
                          selectedPharmacyCosts?.pharmacyType === 2
                            ? mailOrder?.estMonthlyRxDrugCost
                            : selectedPharmacyCosts?.estMonthlyRxDrugCost
                        )
                      )}
                </div>
              </div>
              <div className={`${!breakdownCollapsed ? 'iconReverse' : ''}`}>
                {isMobile && <Arrow color={'#0052CE'} />}
              </div>
            </div>
          )}
        </div>
        <div
          className={`costs-breakdown ${breakdownCollapsed ? 'collapsed' : ''}`}
        >
          <CostBreakdowns
            planData={planData}
            effectiveDate={effectiveDate}
            selectedPharmacyCosts={
              selectedPharmacyCosts?.isMailOrder
                ? mailOrder
                : selectedPharmacyCosts
            }
            mailOrderNotApplicable={mailOrderNotApplicable}
          />
        </div>
      </div>

      {validatePartialYearDrugCost === 'N/A' && planType !== 'MA' && (
        <div>
          <Alert severity='warning'>
            Plan cost data temporarily unavailable, Please add a pharmacy to the
            contact record or try again later.
          </Alert>
        </div>
      )}
      <PlanCoverage
        contact={contact}
        planData={planData}
        contactId={contactId}
        planName={planData?.planName}
        refresh={refresh}
      />
      {getCoverageRecommendations(planData)?.length > 0 && (
        <div className={`coverage ${isMobile ? 'mobile' : ''}`}>
          <SelfRecommendation pills={getCoverageRecommendations(planData)} />
        </div>
      )}
      {!isMobile && (
        <div className={`footer ${isMobile ? 'mobile' : ''}`}>
          <div className={'compare-check '}>
            <input
              type='checkbox'
              className={'compare-inpt'}
              disabled={isCompareDisabled}
              checked={isChecked}
              onChange={e => onChangeCompare(e.target.checked)}
            />
            <span className={'compare-txt'}>Compare</span>{' '}
          </div>
          <div
            onClick={() => onDetailsClick(planData?.id)}
            className='planDetailsBtn'
          >
            Plan Details
          </div>
          {(planData?.planType === 1 || planData?.planType === 2) && (
            <CommissionableInfo status={planData?.commissionable} />
          )}
          {!planData?.nonLicensedPlan && (
            <Button
              label={'Apply'}
              onClick={() => {
                onEnrollClick(true);
                fireEvent('Health Apply CTA Clicked', {
                  leadid: leadId,
                  line_of_business: 'Health',
                  product_type:
                    PLAN_TYPE_ENUMS[planData?.planType]?.toLowerCase(),
                });
              }}
              icon={<FontAwesomeIcon icon={faCircleArrowRight} size={'lg'} />}
              className={'enroll-btn'}
              disabled={disableEnroll}
              style={
                disableEnroll ? { opacity: 0.5, pointerEvent: 'none' } : null
              }
              iconPosition={'right'}
            />
          )}
        </div>
      )}
      {isMobile && (
        <div className={`footer flex-column ${isMobile ? 'mobile' : ''}`}>
          <Box className='mobileFooterSection'>
            <div
              onClick={() => onDetailsClick(planData?.id)}
              className='planDetailsBtn'
            >
              Plan Details
            </div>

            {(planData?.planType === 1 || planData?.planType === 2) && (
              <CommissionableInfo status={planData?.commissionable} />
            )}
          </Box>

          <Box className='mobileFooterSection' marginTop='16px'>
            <div className={'compare-check '}>
              <input
                type='checkbox'
                className={'compare-inpt'}
                disabled={isCompareDisabled}
                checked={isChecked}
                onChange={e => onChangeCompare(e.target.checked)}
              />
              <span className={'compare-txt'}>Compare</span>{' '}
            </div>
            <div>
              {!planData?.nonLicensedPlan && (
                <Button
                  label={'Apply'}
                  onClick={() => {
                    onEnrollClick(true);
                    fireEvent('Health Apply CTA Clicked', {
                      leadid: leadId,
                      line_of_business: 'Health',
                      product_type:
                        PLAN_TYPE_ENUMS[planData?.planType]?.toLowerCase(),
                    });
                  }}
                  icon={
                    <FontAwesomeIcon icon={faCircleArrowRight} size={'lg'} />
                  }
                  className={'enroll-btn'}
                  disabled={disableEnroll}
                  style={
                    disableEnroll
                      ? { opacity: 0.5, pointerEvent: 'none' }
                      : null
                  }
                  iconPosition={'right'}
                />
              )}
            </div>
          </Box>
        </div>
      )}
    </div>
  );
}

PlanCard.propTypes = {
  contact: PropTypes.object.isRequired,
  planData: PropTypes.shape({
    planName: PropTypes.string.isRequired,
    logoURL: PropTypes.string,
    id: PropTypes.string.isRequired,
    planRating: PropTypes.number.isRequired,
    marketingName: PropTypes.string,
    planType: PropTypes.number.isRequired,
    nonLicensedPlan: PropTypes.bool,
    crossUpSellPlanOptions: PropTypes.object,
    estimatedCostCalculationRxs: PropTypes.array,
    estimatedMailOrderCostCalculationRx: PropTypes.object,
    estimatedAnnualDrugCostPartialYear: PropTypes.number,
    drugPremium: PropTypes.number,
    commissionable: PropTypes.bool,
  }).isRequired,
  pharmacyMap: PropTypes.object,
  effectiveDate: PropTypes.string.isRequired,
  onEnrollClick: PropTypes.func.isRequired,
  onDetailsClick: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  onChangeCompare: PropTypes.func.isRequired,
  isChecked: PropTypes.bool.isRequired,
  isCompareDisabled: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
  leadId: PropTypes.string.isRequired,
  selectedPharmacy: PropTypes.object.isRequired,
};
