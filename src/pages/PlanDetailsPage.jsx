import * as Sentry from '@sentry/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Media from 'react-media';
import { useParams } from 'react-router-dom';
import PreEnrollPDFModal from 'components/SharedModals/PreEnrollPdf';

import useRoles from 'hooks/useRoles';
import useToast from 'hooks/useToast';

import NonRTSBanner from 'components/Non-RTS-Banner';
import { BackToTop } from 'components/ui/BackToTop';
import EnrollmentModal from 'components/ui/Enrollment/enrollment-modal';
import SharePlanModal from 'components/ui/SharePlan/sharePlan-modal';
import WithLoader from 'components/ui/WithLoader';
import Container from 'components/ui/container';

import ContactFooter from 'partials/global-footer';
import GlobalNav from 'partials/global-nav-v2';
import MaContent from 'partials/plan-details-content/ma';
import MapdContent from 'partials/plan-details-content/mapd';
import PdpContent from 'partials/plan-details-content/pdp';

import analyticsService from 'services/analyticsService';
import { useClientServiceContext } from 'services/clientServiceProvider';

import { useLeadDetails } from 'providers/ContactDetails';
import SaveToContact from 'components/QuickerQuote/Common/SaveToContact';

import styles from './PlanDetailsPage.module.scss';

import { PLAN_TYPE_ENUMS, MAPD, MA, PDP } from '../constants';

import { useHealth } from 'providers/ContactDetails/ContactDetailsContext';
import { usePharmacyContext } from 'providers/PharmacyProvider';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import { Box, Typography } from '@mui/material';
import { QUOTE_TYPE_LABEL } from 'components/ContactDetailsContainer/OverviewContainer/overviewContainer.constants';
import ConditionalProfileBar from 'components/QuickerQuote/Common/ConditionalProfileBar';

const PlanDetailsPage = () => {
  const showToast = useToast();
  const { contactId, planId, effectiveDate } = useParams();
  const { leadDetails, getLeadDetails, getLeadDetailsAfterSearch } =
    useLeadDetails();
  const { isQuickQuotePage } = useCreateNewQuote();

  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [contact, setContact] = useState(leadDetails);
  const [plan, setPlan] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [filterPharmacyId, setFilterPharmacyId] = useState(null);

  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
  const [linkToExistContactId, setLinkToExistContactId] = useState(null);
  const [preCheckListPdfModal, setPreCheckListPdfModal] = useState(false);
  const [quickQuoteContinueProcess, setQuickQuoteContinueProcess] =
    useState('');

  const { isNonRTS_User } = useRoles();
  const { clientsService, plansService } = useClientServiceContext();
  const { pharmacies, fetchPharmacies } = useHealth() || {};
  const { selectedPharmacy } = usePharmacyContext();

  const getPlanDetails = async (pharmacyId, contactData) => {
    const planData = await plansService.getPlan(
      contactId,
      planId,
      contactData,
      effectiveDate,
      pharmacyId
    );

    if (!planData) {
      showToast({
        type: 'error',
        message: 'There was an error loading the plan.',
      });
    }
    setPlan(planData);
    setContact(contactData);
  };

  const getContactAndPlanData = useCallback(async () => {
    try {
      const updatedData = await fetchPharmacies(contactId);
      const pharmacyId =
        updatedData.length > 0
          ? updatedData.find(pharmacy => pharmacy.isPrimary)?.pharmacyId
          : null;
      await getPlanDetails(pharmacyId, leadDetails);
      analyticsService.fireEvent('event-content-load', {
        pagePath: '/:contactId/plan/:planId',
      });
    } catch (e) {
      Sentry.captureException(e);
      showToast({
        type: 'error',
        message: 'There was an error loading the plan.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    contactId,
    planId,
    showToast,
    effectiveDate,
    fetchPharmacies,
    clientsService,
    plansService,
    pharmacies,
    selectedPharmacy,
    leadDetails,
  ]);

  useEffect(() => {
    if (filterPharmacyId !== selectedPharmacy?.pharmacyId) {
      getPlanDetails(selectedPharmacy?.pharmacyId, leadDetails).then(() => {
        setFilterPharmacyId(selectedPharmacy?.pharmacyId);
      });
    }
  }, [selectedPharmacy]);

  useEffect(() => {
    getContactAndPlanData();
  }, []);

  useEffect(() => {
    if (!leadDetails && contactId) {
      getLeadDetails(contactId);
    }
  }, [contactId, getLeadDetails, leadDetails]);

  const handleOpenQuickQuoteShareModal = async leadId => {
    const response = await getLeadDetailsAfterSearch(leadId, true);
    if (response) {
      setContact(response);
      setShareModalOpen(true);
    }
  };

  return (
    <React.Fragment>
      <div
        className={`${styles['plan-details-page']}`}
        style={isLoading ? { background: '#ffffff' } : {}}
      >
        <Media
          query={'(max-width: 500px)'}
          onChange={isMobileDevice => {
            setIsMobile(isMobileDevice);
          }}
        />

        <WithLoader isLoading={isLoading}>
          <Helmet>
            <title>Integrity - Plans</title>
          </Helmet>
          <GlobalNav showQuoteType={QUOTE_TYPE_LABEL.MEDICARE} />

          <ConditionalProfileBar
            leadId={contactId}
            page='healthPlanDetailsPage'
            hideBackButton={false}
            backRoute={`/plans/${contactId}`}
            navPath={`plan/${planId}/${effectiveDate}`}
          />
          <Box sx={{ padding: '56px 24px', pb: 0 }}>
            <Box sx={{ pb: 3 }} display={'flex'} justifyContent={'center'}>
              <Typography variant='h2' gutterBottom color={'#052a63'}>
                {plan?.planType === 2 && MAPD}
                {plan?.planType === 4 && MA}
                {plan?.planType === 1 && PDP}
              </Typography>
            </Box>
          </Box>
          {isNonRTS_User && <NonRTSBanner />}

          <Container className={`${styles['body']}`}>
            {plan && PLAN_TYPE_ENUMS[plan.planType] === 'MAPD' && (
              <MapdContent
                contact={contact}
                plan={plan}
                styles={styles}
                isMobile={isMobile}
                onShareClick={() => {
                  if (isQuickQuotePage) {
                    setQuickQuoteContinueProcess('share');
                    setContactSearchModalOpen(true);
                  } else {
                    setShareModalOpen(true);
                  }
                }}
                onEnrollClick={() => {
                  if (isQuickQuotePage) {
                    setQuickQuoteContinueProcess('enroll');
                    setContactSearchModalOpen(true);
                  } else {
                    setPreCheckListPdfModal(true);
                  }
                }}
                refresh={getContactAndPlanData}
                leadId={contactId}
              />
            )}
            {plan && PLAN_TYPE_ENUMS[plan.planType] === 'PDP' && (
              <PdpContent
                contact={contact}
                plan={plan}
                styles={styles}
                isMobile={isMobile}
                onShareClick={() => {
                  if (isQuickQuotePage) {
                    setQuickQuoteContinueProcess('share');
                    setContactSearchModalOpen(true);
                  } else {
                    setShareModalOpen(true);
                  }
                }}
                onEnrollClick={() => {
                  if (isQuickQuotePage) {
                    setQuickQuoteContinueProcess('enroll');
                    setContactSearchModalOpen(true);
                  } else {
                    setPreCheckListPdfModal(true);
                  }
                }}
                refresh={getContactAndPlanData}
                leadId={contactId}
              />
            )}
            {plan && PLAN_TYPE_ENUMS[plan.planType] === 'MA' && (
              <MaContent
                plan={plan}
                styles={styles}
                isMobile={isMobile}
                onShareClick={() => {
                  if (isQuickQuotePage) {
                    setQuickQuoteContinueProcess('share');
                    setContactSearchModalOpen(true);
                  } else {
                    setShareModalOpen(true);
                  }
                }}
                onEnrollClick={() => {
                  if (isQuickQuotePage) {
                    setQuickQuoteContinueProcess('enroll');
                    setContactSearchModalOpen(true);
                  } else {
                    setPreCheckListPdfModal(true);
                  }
                }}
                refresh={getContactAndPlanData}
                leadId={contactId}
              />
            )}
          </Container>

          <ContactFooter />
          <BackToTop />
          {!isLoading && (
            <>
              {modalOpen && (
                <EnrollmentModal
                  modalOpen={modalOpen}
                  planData={plan}
                  contact={contact}
                  handleCloseModal={() => setModalOpen(false)}
                  effectiveDate={effectiveDate}
                  isApplyProcess={isQuickQuotePage}
                  linkToExistContactId={linkToExistContactId}
                  defaultNavPath={`/${linkToExistContactId}/plan/${planId}/${effectiveDate}`}
                />
              )}
              {preCheckListPdfModal && (
                <PreEnrollPDFModal
                  open={preCheckListPdfModal}
                  onClose={() => {
                    setPreCheckListPdfModal(false);
                    setModalOpen(true);
                  }}
                />
              )}
              {shareModalOpen && (
                <SharePlanModal
                  modalOpen={shareModalOpen}
                  planData={plan}
                  contact={contact}
                  handleCloseModal={() => setShareModalOpen(false)}
                  effectiveDate={effectiveDate}
                  isApplyProcess={isQuickQuotePage}
                  linkToExistContactId={linkToExistContactId}
                  defaultNavPath={`/${linkToExistContactId}/plan/${planId}/${effectiveDate}`}
                />
              )}
            </>
          )}
        </WithLoader>
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
      </div>
    </React.Fragment>
  );
};

export default PlanDetailsPage;
