import React, { useMemo, useEffect, useState } from 'react';
import { QuickQuoteProfileBanner } from '@integritymarketing/clients-ui-kit';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import { ContactProfileTabBar } from 'components/ContactDetailsContainer/ContactProfileTabBar';
import WithLoader from 'components/ui/WithLoader';
import PropTypes from 'prop-types';
import SaveToContact from '../SaveToContact';
import { useNavigate } from 'react-router-dom';

const ConditionalProfileBar = ({ leadId, backRoute, page }) => {
  const [contactSearchModalOpen, setContactSearchModalOpen] = useState(false);
  const navigate = useNavigate();
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

  const handleCallBack = leadId => {
    setContactSearchModalOpen(false);

    if (page === 'accumulation') {
      navigate(`/life/iul-accumulation/${leadId}/quote`);
    }
    if (page === 'protection') {
      navigate(`/life/iul-protection/${leadId}/quote`);
    }
    if (page === 'finalExpense') {
      navigate(`/finalexpenses/plans/${leadId}`);
    }
    if (page === 'simplifiedIUL') {
      navigate(`/simplified-iul/plans/${leadId}`);
    }
    if (page === 'healthPlans') {
      navigate(`/plans/${leadId}`);
    }
  };

  return (
    <WithLoader isLoading={isLoadingQuickQuoteLeadDetails}>
      {isQuickQuotePage ? (
        <QuickQuoteProfileBanner
          title={'Quick Quote'}
          location={stateCode}
          age={age}
          gender={gender}
          buttonLabel={'Save to a Contact'}
          onButtonClick={() => {
            setContactSearchModalOpen(true);
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
        />
      )}

      <SaveToContact
        contactSearchModalOpen={contactSearchModalOpen}
        handleClose={() => setContactSearchModalOpen(false)}
        handleCallBack={handleCallBack}
        leadId={leadId}
      />
    </WithLoader>
  );
};

ConditionalProfileBar.propTypes = {
  children: PropTypes.node.isRequired,
  action: PropTypes.func,
};

export default ConditionalProfileBar;
