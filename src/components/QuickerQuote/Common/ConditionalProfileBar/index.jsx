import React, { useMemo, useEffect, useState } from 'react';
import { QuickQuoteProfileBanner } from '@integritymarketing/clients-ui-kit';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import { ContactProfileTabBar } from 'components/ContactDetailsContainer/ContactProfileTabBar';
import WithLoader from 'components/ui/WithLoader';
import PropTypes from 'prop-types';
import SaveToContact from '../SaveToContact';

const ConditionalProfileBar = ({
  leadId,
  backRoute,
  page,
  hideButton = false,
  hideBackButton = true,
  stickyHeader = true,
  navPath,
}) => {
  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
  const {
    quickQuoteLeadDetails,
    isLoadingQuickQuoteLeadDetails,
    getQuickQuoteLeadById,
    isQuickQuotePage,
  } = useCreateNewQuote();

  useEffect(() => {
    if (leadId && isQuickQuotePage && !quickQuoteLeadDetails) {
      getQuickQuoteLeadById(leadId);
    }
  }, [leadId, getQuickQuoteLeadById, isQuickQuotePage]);

  const stateCode = useMemo(() => {
    return (quickQuoteLeadDetails && quickQuoteLeadDetails?.stateCode) || '';
  }, [quickQuoteLeadDetails]);

  const gender = useMemo(() => {
    return (quickQuoteLeadDetails && quickQuoteLeadDetails?.gender) || '';
  }, [quickQuoteLeadDetails]);

  const age = useMemo(() => {
    return (quickQuoteLeadDetails && quickQuoteLeadDetails?.age) || '';
  }, [quickQuoteLeadDetails]);

  return (
    <WithLoader isLoading={isLoadingQuickQuoteLeadDetails}>
      {isQuickQuotePage ? (
        <QuickQuoteProfileBanner
          title={'Quick Quote'}
          location={stateCode}
          age={age || null}
          gender={gender}
          buttonLabel={'Save to a Contact'}
          onButtonClick={() => {
            setContactSearchModalOpen(true);
          }}
          hideButton={hideButton}
          hideBackButton={hideBackButton}
          onBackButtonClick={() => {
            window.history.back();
          }}
        />
      ) : (
        <ContactProfileTabBar
          contactId={leadId}
          showTabs={false}
          backButtonLabel='Back'
          backButtonRoute={
            backRoute ? backRoute : `/contact/${leadId}/overview`
          }
          stickyHeader={stickyHeader}
        />
      )}

      <SaveToContact
        contactSearchModalOpen={contactSearchModalOpen}
        handleClose={() => setContactSearchModalOpen(false)}
        handleCallBack={() => setContactSearchModalOpen(false)}
        leadId={leadId}
        page={page}
        navPath={navPath}
      />
    </WithLoader>
  );
};

ConditionalProfileBar.propTypes = {
  hideBackButton: PropTypes.bool,
  backRoute: PropTypes.string || null,
  leadId: PropTypes.string,
  stickyHeader: PropTypes.bool,
  page: PropTypes.string,
  hideButton: PropTypes.bool,
  navPath: PropTypes.string,
};

export default ConditionalProfileBar;
