import { useState } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/react';
import { useNavigate, useLocation } from 'react-router';
import styles from './EnrollmentPlanCard.module.scss';
import IconWithText from 'packages/IconWithText';
import View from './View.png';
import Link from './Link.png';
import Media from 'react-media';
import Icon from 'components/Icon';
import { Button } from 'components/ui/Button';
import SharePlan from 'components/icons/sharePlan';
import {
  capitalizeFirstLetter,
  formattedName,
} from 'utils/shared-utils/sharedUtility';
import OpenIcon from 'components/icons/open';
import Relink from '../Icons/relink';
import LifePolicy from 'components/LifePolicy';
import HealthPolicy from 'components/HealthPolicy';

function EnrollmentPlanCard({
  submittedDate,
  policyEffectiveDate,
  termedDate,
  policyHolder,
  policyId = 'N/A',
  currentYear = true,
  leadId,
  isEnrollPlansPage,
  onShareClick,
  policyStatus,
  confirmationNumber,
  isEmail = false,
  planName,
  carrier = 'N/A',
  planId = 'N/A',
  hasPlanDetails,
  productCategory = 'N/A',
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const holderName = policyHolder ? formattedName(policyHolder) : '';
  const isFinalExpense = productCategory === 'Final Expense';
  const status =
    policyStatus === 'terminated'
      ? 'Inactive'
      : capitalizeFirstLetter(policyStatus);

  const navigateEnrollDetails = () => {
    navigate(
      `/enrollmenthistory/${leadId}/${confirmationNumber}/${policyEffectiveDate}`,
      { state: props }
    );
  };

  const navigateToEnrollmentLink = () => {
    navigate(`/enrollment-link-to-contact`, { state: props });
  };

  const handleShareClick = async () => {
    try {
      await onShareClick();
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const renderPlanDetails = (label, value) => (
    <div>
      <div className={styles.planLabel}>{label} </div>
      <div className={styles.planValue}>{value}</div>
    </div>
  );

  const renderPlanFooterDetails = (label, value) => (
    <div>
      <div className={styles.label}>{label}: </div>
      <div className={styles.value}>{value}</div>
    </div>
  );

  const PlanDate = ({ type, date }) => (
    <div className={styles.date}>
      <div className={styles.planLabel}>{type} </div>
      <div className={styles.planValue}>{date}</div>
    </div>
  );

  return (
    <div className={styles.planCardContainer}>
      <Media
        query={'(max-width: 500px)'}
        onChange={isMobile => setIsMobile(isMobile)}
      />
      <div
        className={`${styles.planCard} ${
          !currentYear ? styles.isBordered : ''
        }`}
      >
        <div
          className={`${!currentYear ? styles.previousYear : ''} ${
            styles.planDetails
          }`}
        >
          <div className={styles.statusIconAndPlanNameContainer}>
            <div
              className={styles.statusIcon}
              style={{ backgroundColor: !currentYear ? '#F1FAFF' : '#FFFFFF' }}
            >
              {isFinalExpense ? (
                <LifePolicy status={status} />
              ) : (
                <HealthPolicy status={status} />
              )}
            </div>
            <div className={styles.planNameAndStatus}>
              <div className={styles.planName}>{planName}</div>
              <div className={styles.status}>
                <span className={styles.statusLabel}>Status:</span>
                <span className={styles.statusValue}>{policyStatus}</span>
              </div>
            </div>
          </div>
          <div className={styles.detailsContainer}>
            <div
              className={styles.detailAndDateContainer}
              style={{ backgroundColor: !currentYear ? '#F1F1F1' : '#FFFFFF' }}
            >
              <div>{renderPlanDetails('Product Type', productCategory)}</div>
              <div>{renderPlanDetails('Carrier', carrier)}</div>
              <div>{renderPlanDetails('Plan ID', planId ? planId : '--')}</div>
              <div className={styles.dates}>
                {currentYear ? (
                  <>
                    {submittedDate && !isFinalExpense && (
                      <PlanDate type={'Submitted'} date={submittedDate} />
                    )}
                    {(policyStatus === 'upcoming' ||
                      policyStatus === 'active') &&
                      policyEffectiveDate &&
                      isFinalExpense && (
                        <PlanDate
                          type={'Effective'}
                          date={policyEffectiveDate}
                        />
                      )}
                  </>
                ) : (
                  <>
                    {policyEffectiveDate && (
                      <PlanDate
                        type={isFinalExpense ? 'Effective' : 'Submitted'}
                        date={policyEffectiveDate}
                      />
                    )}
                    {termedDate && <PlanDate type='Termed' date={termedDate} />}
                  </>
                )}
              </div>
            </div>
            {!isEmail && (
              <div className={styles.links}>
                {isEnrollPlansPage ? (
                  <ShareButton
                    isMobile={isMobile}
                    handleShareClick={handleShareClick}
                  />
                ) : (
                  <PlanLinks
                    hasPlanDetails={hasPlanDetails}
                    navigateEnrollDetails={navigateEnrollDetails}
                    navigateToEnrollmentLink={navigateToEnrollmentLink}
                    location={location}
                    policyStatus={policyStatus}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`${!currentYear ? styles.previousYear : ''} ${
          styles.policyDetails
        }`}
      >
        <div className={styles.policyHolder}>
          {renderPlanFooterDetails('Policy Holder', holderName)}
        </div>
        {policyId && (
          <div className={styles.policyId}>
            {renderPlanFooterDetails('Policy ID', policyId)}
          </div>
        )}
      </div>
    </div>
  );
}

const ShareButton = ({ isMobile, handleShareClick }) => {
  return isMobile ? (
    <div className={styles.shareBtnContainer} onClick={handleShareClick}>
      <span className={styles.shareText}>Share</span>
      <SharePlan />
    </div>
  ) : (
    <Button
      label='Share Plan'
      onClick={handleShareClick}
      type='secondary'
      className={styles.shareBtn}
    />
  );
};

const PlanLinks = ({
  hasPlanDetails,
  navigateEnrollDetails,
  navigateToEnrollmentLink,
  location,
  policyStatus,
}) => {
  return (
    <Media queries={{ small: '(max-width: 767px)' }}>
      {matches =>
        matches.small ? (
          <>
            {hasPlanDetails && (
              <div onClick={navigateEnrollDetails}>
                <IconWithText
                  text='View Policy'
                  icon={
                    <Icon
                      altText='View'
                      className={styles.iconPng}
                      image={View}
                    />
                  }
                  screensize='small'
                />
              </div>
            )}
            {!location.pathname.includes('enrollment-link-to-contact') &&
              policyStatus !== 'started' && (
                <div onClick={navigateToEnrollmentLink}>
                  <IconWithText
                    text='Relink Policy'
                    icon={
                      <Icon
                        altText='Link'
                        className={styles.iconPng}
                        image={Link}
                      />
                    }
                    screensize='small'
                  />
                </div>
              )}
          </>
        ) : (
          <>
            {hasPlanDetails && (
              <Button
                icon={<OpenIcon />}
                label={'View Policy'}
                className={styles.viewButton}
                onClick={navigateEnrollDetails}
                type='tertiary'
                iconPosition='right'
              />
            )}
            {!location.pathname.includes('enrollment-link-to-contact') &&
              policyStatus !== 'started' && (
                <Button
                  icon={<Relink color='#4178FF' />}
                  label={'Relink Policy'}
                  className={styles.relinkButton}
                  onClick={navigateToEnrollmentLink}
                  type='tertiary'
                  iconPosition='right'
                />
              )}
          </>
        )
      }
    </Media>
  );
};

EnrollmentPlanCard.propTypes = {
  submittedDate: PropTypes.string,
  enrolledDate: PropTypes.string,
  policyEffectiveDate: PropTypes.string,
  termedDate: PropTypes.string,
  policyHolder: PropTypes.object,
  policyId: PropTypes.string,
  currentYear: PropTypes.bool,
  leadId: PropTypes.string.isRequired,
  isEnrollPlansPage: PropTypes.bool,
  onShareClick: PropTypes.func.isRequired,
  policyStatus: PropTypes.string.isRequired,
  confirmationNumber: PropTypes.string.isRequired,
  isEmail: PropTypes.bool,
  planName: PropTypes.string.isRequired,
  carrier: PropTypes.string,
  planId: PropTypes.string,
  hasPlanDetails: PropTypes.bool,
  productCategory: PropTypes.string,
};

export default EnrollmentPlanCard;
