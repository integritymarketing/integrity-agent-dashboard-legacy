import * as Sentry from '@sentry/react';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import shouldDisableEnrollButtonBasedOnEffectiveDate from 'utils/shouldDisableEnrollButtonBasedOnEffectiveDate';
import ComparePlanModal from 'components/ui/ComparePlanModal';

import useRoles from 'hooks/useRoles';
import useToast from 'hooks/useToast';

import PreEnrollPDFModal from 'components/SharedModals/PreEnrollPdf';
import Container from 'components/ui/container';

import useAnalytics from 'hooks/useAnalytics';
import { useClientServiceContext } from 'services/clientServiceProvider';

import styles from '../../../pages/PlansPage.module.scss';

import { Button } from '../Button';
import EnrollmentModal from '../Enrollment/enrollment-modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowShare } from '@awesome.me/kit-7ab3488df1/icons/kit/custom';
import { faCircleArrowRight } from '@awesome.me/kit-7ab3488df1/icons/classic/light';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import SaveToContact from 'components/QuickerQuote/Common/SaveToContact';
import { useLeadDetails } from 'providers/ContactDetails';

import { PLAN_TYPE_ENUMS } from 'src/constants';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const LOGO_BASE_URL =
  'https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/';

export default function ComparePlansByPlanName({
  agentInfo = {},
  comparePlans,
  handleRemovePlan,
  id,
  plansLoading,
  isEmail = false,
  isModal = false,
  contactData,
  isComingFromEmail,
}) {
  const showToast = useToast();
  const { clientsService, enrollPlansService } = useClientServiceContext();
  const { contactId, planIds: comparePlanIds, effectiveDate } = useParams();

  const planIds = useMemo(() => comparePlanIds.split(','), [comparePlanIds]);
  const { getLeadDetailsAfterSearch } = useLeadDetails();

  const [userData, setUserData] = useState(contactData);
  const [modalOpen, setModalOpen] = useState(false);
  const [enrollingPlan, setEnrollingPlan] = useState();
  const [preCheckListPdfModal, setPreCheckListPdfModal] = useState(false);
  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
  const [linkToExistContactId, setLinkToExistContactId] = useState(null);
  const [comparePlanModalOpen, setComparePlanModalOpen] = useState(false);
  const [quickQuoteContinueProcess, setQuickQuoteContinueProcess] =
    useState('');

  const { isNonRTS_User } = useRoles();
  const { fireEvent } = useAnalytics();
  const { isQuickQuotePage } = useCreateNewQuote();

  const isEmailNonRts = isEmail
    ? agentInfo?.Roles?.includes('nonRts')
    : isNonRTS_User;

  const disableEnroll =
    shouldDisableEnrollButtonBasedOnEffectiveDate(effectiveDate);

  useEffect(() => {
    if (!userData && id) {
      const getContactInfo = async () => {
        const contactDataResponse = await clientsService.getContactInfo(id);
        setUserData(contactDataResponse);
      };
      getContactInfo();
    }
  }, [id, userData]);

  const handleOnClick = () => {
    setModalOpen(true);
  };

  const handleBenificiaryClick = useCallback(async plan => {
    try {
      const enrolled = await enrollPlansService.enrollConsumer(
        id,
        plan.id,
        {
          enrollRequest: {
            firstName: agentInfo?.LeadFirstName,
            lastName: agentInfo?.LeadLastName,
            zip: agentInfo?.ZipCode,
            countyFIPS: agentInfo?.CountyFIPS,
            phoneNumber: agentInfo?.AgentPhoneNumber,
            email: agentInfo?.AgentEmail,
            sendToBeneficiary: true,
            middleInitial:
              agentInfo?.MiddleInitial === '' ? null : agentInfo.MiddleInitial,
            dateOfBirth: agentInfo?.DateOfBirth,
            state: agentInfo?.State,
            effectiveDate: effectiveDate,
          },
          planDetail: plan,
        },
        agentInfo.AgentNpn
      );

      if (enrolled && enrolled.url) {
        window.open(enrolled.url, '_blank').focus();
        showToast({
          type: 'success',
          message: 'Successfully Sent to Client',
        });
      } else {
        showToast({
          type: 'error',
          message: 'There was an error enrolling the contact.',
        });
      }
    } catch (error) {
      Sentry.captureException(error);
      showToast({
        type: 'error',
        message: 'There was an error enrolling the contact.',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenQuickQuoteShareModal = async leadId => {
    const response = await getLeadDetailsAfterSearch(leadId, true);
    if (response) {
      setUserData(response);
      setComparePlanModalOpen(true);
    }
  };

  return (
    <Container className={styles.stickyHeader}>
      <div
        className={`${styles['plan-comparison-header']} ${
          plansLoading && styles['display-initial']
        } container ${isModal && styles['in-modal']}`}
      >
        {comparePlans.length > 0 && (
          <>
            {!isModal && !isEmail && (
              <div className={`${styles['compare-div']}`}>
                <div className={`${styles['vertical-stack']}`}>
                  <div className={`${styles['compare-text']}`}>
                    Compare Plans
                  </div>
                  <div className={`${styles['spacer']}`}></div>
                  <>
                    <div className={`${styles['share-plan-text']}`}>
                      Share plans with client
                    </div>

                    <Button
                      label='Share'
                      icon={<FontAwesomeIcon icon={faArrowShare} />}
                      onClick={() => {
                        if (isQuickQuotePage) {
                          setQuickQuoteContinueProcess('share');
                          setContactSearchModalOpen(true);
                        } else {
                          setComparePlanModalOpen(true);
                        }
                      }}
                      type='secondary'
                      className={`${styles['share-btn']} ${styles['mobile']}`}
                      iconPosition={'right'}
                    />
                  </>
                </div>
                <span className={`${styles['plan-separator']}`}></span>
              </div>
            )}
            {isEmail && (
              <div className={`${styles['compare-div']}`}>
                <div className={`${styles['compare-text']}`}>Compare Plans</div>
                <div className={`${styles['spacer']}`}></div>
              </div>
            )}
            {comparePlans?.map((plan, idx) => (
              <div key={idx} className={`${styles['plan-div']}`}>
                <div
                  className={`${styles['comp-mr-left']} ${styles['compr-plan-col-hdr']}`}
                >
                  <div>
                    {' '}
                    <img
                      src={LOGO_BASE_URL + plan.logoURL}
                      alt='logo'
                      className={styles['plan-img']}
                    />
                  </div>
                  <div className={styles['comp-plan-name']}>
                    {plan && plan.planName}
                  </div>
                  <div className={styles['comp-plan-amnt']}>
                    <span className={styles['value']}>
                      {currencyFormatter.format(plan.annualPlanPremium / 12)}
                      <span className={styles['per']}> / month</span>
                    </span>
                  </div>
                  {!plan.nonLicensedPlan &&
                    !isModal &&
                    !isEmail &&
                    !isEmailNonRts && (
                      <>
                        <Button
                          label={'Apply'}
                          onClick={() => {
                            fireEvent('Health Apply CTA Clicked', {
                              leadid: String(contactId),
                              line_of_business: 'Health',
                              product_type:
                                PLAN_TYPE_ENUMS[plan.planType]?.toLowerCase(),
                            });
                            setEnrollingPlan(plan);

                            if (isQuickQuotePage) {
                              setContactSearchModalOpen(true);
                              setQuickQuoteContinueProcess('enroll');
                            } else {
                              setPreCheckListPdfModal(true);
                            }
                          }}
                          icon={
                            <FontAwesomeIcon
                              icon={faCircleArrowRight}
                              size={'xl'}
                            />
                          }
                          className={styles['enroll-btn']}
                          iconPosition={'right'}
                          disabled={
                            disableEnroll ||
                            (plan?.planType === 2 &&
                              plan?.commissionable === false)
                          }
                        />

                        {preCheckListPdfModal && (
                          <PreEnrollPDFModal
                            open={preCheckListPdfModal}
                            onClose={() => {
                              setPreCheckListPdfModal(false);
                              handleOnClick();
                            }}
                          />
                        )}
                      </>
                    )}
                  {!plan.nonLicensedPlan &&
                    !isModal &&
                    isEmail &&
                    !isEmailNonRts && (
                      <>
                        <Button
                          label={'Apply'}
                          onClick={() => {
                            setEnrollingPlan(plan);

                            if (isQuickQuotePage) {
                              setContactSearchModalOpen(true);
                              setQuickQuoteContinueProcess('enroll');
                            } else {
                              setPreCheckListPdfModal(true);
                            }
                          }}
                          icon={
                            <FontAwesomeIcon
                              icon={faCircleArrowRight}
                              size={'xl'}
                            />
                          }
                          className={styles['enroll-btn']}
                          iconPosition={'right'}
                          disabled={
                            disableEnroll ||
                            (plan?.planType === 2 &&
                              plan?.commissionable === false)
                          }
                        />
                        {preCheckListPdfModal && (
                          <PreEnrollPDFModal
                            open={preCheckListPdfModal}
                            onClose={() => {
                              setPreCheckListPdfModal(false);
                              handleBenificiaryClick(plan);
                            }}
                          />
                        )}
                      </>
                    )}
                  {!isModal && !isEmail && comparePlans.length > 2 && (
                    <span
                      className={styles.close}
                      onClick={() => handleRemovePlan(plan.id)}
                    >
                      X
                    </span>
                  )}
                </div>
                <div className={`${styles['plan-seperator']}`}></div>
              </div>
            ))}
            {!isEmail && comparePlans.length < 3 && (
              <div className={`${styles['plan-div']}`}>
                <span className={styles['retrun-txt']}>
                  <a href={`/plans/${id}?preserveSelected=true`}>
                    Return to plans list to add{' '}
                    {comparePlans.length === 1 ? '2nd' : '3rd'} plan for
                    Comparison.
                  </a>
                </span>
              </div>
            )}
          </>
        )}
        <EnrollmentModal
          modalOpen={modalOpen}
          planData={enrollingPlan}
          contact={userData}
          handleCloseModal={() => setModalOpen(false)}
          effectiveDate={effectiveDate}
          isApplyProcess={isQuickQuotePage}
          linkToExistContactId={linkToExistContactId}
          navPath={`/compare/${planIds.join(',')}/${effectiveDate}`}
        />

        <SaveToContact
          contactSearchModalOpen={contactSearchModalOpen}
          handleClose={() => setContactSearchModalOpen(false)}
          handleCallBack={response => {
            setLinkToExistContactId(response?.leadsId);
            if (quickQuoteContinueProcess === 'share') {
              handleOpenQuickQuoteShareModal(response?.leadsId);
            }
            if (quickQuoteContinueProcess === 'enroll') {
              setPreCheckListPdfModal(true);
            }
          }}
          page='healthPlans'
          isApplyProcess={true}
        />
        {!isComingFromEmail && comparePlanModalOpen && (
          <ComparePlanModal
            modalOpen={comparePlanModalOpen}
            handleCloseModal={() => setComparePlanModalOpen(false)}
            comparePlans={comparePlans}
            handleRemovePlan={handleRemovePlan}
            id={id}
            plansLoading={plansLoading}
            contactData={userData}
            isApplyProcess={isQuickQuotePage}
            linkToExistContactId={linkToExistContactId}
            navPath={`/compare/${planIds.join(',')}/${effectiveDate}`}
          />
        )}
      </div>
    </Container>
  );
}
