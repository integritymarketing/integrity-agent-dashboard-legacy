import * as Sentry from '@sentry/react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Heading3 from 'packages/Heading3';

import GoBackNavbar from 'components/BackButtonNavbar';
import EnrollmentPlanCard from 'components/EnrollmentHistoryContainer/EnrollmentPlanCard/EnrollmentPlanCard';

import Footer from 'partials/global-footer';
import GlobalNav from 'partials/global-nav-v2';

import DashboardHeaderSection from 'pages/dashbaord/DashboardHeaderSection';
import { useContactListAPI } from 'providers/ContactListAPIProviders';

import ContactSearch from './ContactSearch';
import CreateNewContact from './CreateNewContact';
import PossibleMatches from './PossibleMatches';
import styles from './styles.module.scss';

export default function EnrollmentLinkToContact() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const { callLogId, callFrom } = useParams();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getLeadsList } = useContactListAPI();

  const policy = state?.policyNumber || state?.policyId;

  const getContacts = async searchStr => {
    setIsLoading(true);
    try {
      const response = await getLeadsList(
        undefined,
        undefined,
        ['Activities.CreateDate:desc'],
        searchStr
      );
      if (response && response.result) {
        setContacts(response.result);
      }
      // setIsLoading(false);
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  };
  const bannerContent = () => {
    return (
      <>
        <Heading3 text='Link to contacts' />
      </>
    );
  };

  const goToAddNewContactsPage = () => {
    if (callLogId) {
      navigate(
        `/contact/add-new/${callLogId}?callFrom=${callFrom}&relink=true"
        }`,
        { state: state }
      );
    } else {
      navigate(`/contact/add-new?relink=true`, { state: state });
    }
  };

  const handleBackToRoute = () => {
    if (state?.page === 'Contacts Details') {
      navigate(`/contact/${state?.leadId}/overview`);
    } else if (state?.page === 'Dashboard') {
      navigate(`/dashboard`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Integrity - Enrollment Link to Contact</title>
      </Helmet>
      <GlobalNav />
      <GoBackNavbar
        title={`Back to ${state?.page}`}
        handleBackToRoute={handleBackToRoute}
      />
      <DashboardHeaderSection
        content={bannerContent()}
        justifyContent={'space-between'}
        padding={'0 10%'}
        className={styles.headerSection}
      />
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <EnrollmentPlanCard
            key={state?.policyId}
            currentYear={state?.currentYear}
            submittedDate={state?.submitDate || 'Not Provided by Carrier'}
            enrolledDate={state?.enrolledDate}
            policyEffectiveDate={state?.policyEffectiveDate}
            policyId={policy}
            leadId={state?.leadId}
            planId={state?.planId}
            agentNpn={state?.agentNpn}
            carrier={state?.carrier}
            consumerSource={state?.consumerSource}
            hasPlanDetails={state?.hasPlanDetails}
            policyStatus={state?.policyStatus}
            confirmationNumber={state?.confirmationNumber}
            page='Contacts Details'
            planName={state?.planName}
            termedDate={state?.termedDate}
            policyStatusColor={state?.policyStatusColor}
            policyHolder={state?.policyHolder}
            linkingType={state?.linkingType}
            productCategory={state?.productCategory}
          />

          <div className={styles.contactsContainer}>
            <PossibleMatches
              phone={callFrom}
              policyHolder={state?.policyHolder}
              state={state}
            />

            <div className={styles.medContent}>
              <CreateNewContact
                goToAddNewContactsPage={goToAddNewContactsPage}
              />
            </div>
            <div className={styles.medContent}>
              <div className={styles.container}>
                <ContactSearch
                  isLoading={isLoading}
                  onChange={getContacts}
                  contacts={contacts}
                  state={state}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
