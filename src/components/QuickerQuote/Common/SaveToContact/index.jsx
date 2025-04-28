import React, { useState, useCallback, useEffect } from 'react';
import ContactSearchModal from '../ContactSearchModal';
import CreateContactForm from '../CreateContactForm';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import LinkToContact from '../LinkToContact';
import { useNavigate } from 'react-router-dom';
import useAnalytics from 'hooks/useAnalytics';

const getFormattedPhone = phone =>
  phone ? `${phone}`.replace(/\D/g, '') : null;

const SaveToContact = ({
  contactSearchModalOpen,
  handleClose,
  handleCallBack,
  page,
  isApplyProcess = false,
  navPath,
}) => {
  const {
    quickQuoteLeadDetails,
    saveQuickQuoteLeadDetails,
    existingLinkLeadToQuickQuote,
    isLoadingExistingLinkLeadToQuickQuote,
  } = useCreateNewQuote();
  const navigate = useNavigate();
  const { fireEvent } = useAnalytics();

  const [createNewContactModalOpen, setCreateNewContactModalOpen] =
    useState(false);
  const [linkToContactModalOpen, setLinkToContactModalOpen] = useState(false);

  const [selectedLead, setSelectedLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phones: {
      leadPhone: '',
      phoneLabel: '',
    },
    primaryCommunication: '',
  });

  const navWithCallBack = useCallback(
    (path, response) => {
      if (!isApplyProcess) {
        navigate(path);
      }
      handleClose();
      setTimeout(() => {
        handleCallBack(response);
      }, 2000);
    },
    [handleCallBack, isApplyProcess]
  );

  const handlelingNavWithCallBack = useCallback(
    response => {
      const code = JSON.stringify({
        stateCode: response?.addresses[0]?.stateCode,
      });
      sessionStorage.setItem(response?.leadsId, code);

      const leadId = response?.leadsId;

      if (page === 'finalExpense') {
        navWithCallBack(`/finalexpenses/plans/${leadId}`, response);
      }
      if (page === 'simplifiedIUL') {
        navWithCallBack(`/simplified-iul/plans/${leadId}`, response);
      }
      if (page === 'healthPlans') {
        navWithCallBack(`/plans/${leadId}`, response);
      }
      if (page === 'healthPlanDetailsPage') {
        navWithCallBack(`/${leadId}/${navPath}`, response);
      }
      if (page === 'healthComparePlansPage') {
        navWithCallBack(`/plans/${leadId}/${navPath}`, response);
      }
      if (page === 'accumulation plans page') {
        navWithCallBack(`/life/iul-accumulation/${leadId}/quote`, response);
      }
      if (page === 'protection plans page') {
        navWithCallBack(`/life/iul-protection/${leadId}/quote`, response);
      }
      if (page === 'accumulation plans details page') {
        navWithCallBack(
          `/life/iul-accumulation/${leadId}/${navPath}`,
          response
        );
      }
      if (page === 'protection plans details page') {
        navWithCallBack(`/life/iul-protection/${leadId}/${navPath}`, response);
      }

      if (page === 'accumulation plan compare page') {
        navWithCallBack(
          `/life/iul-accumulation/${leadId}/${navPath}`,
          response
        );
      }
      if (page === 'protection plan compare page') {
        navWithCallBack(`/life/iul-protection/${leadId}/${navPath}`, response);
      } else {
        navWithCallBack(``, response);
      }
    },
    [navWithCallBack, page, navPath]
  );

  const handleSelectedLead = useCallback(
    (lead, type) => {
      if (type === 'new') {
        setSelectedLead({
          ...selectedLead,
          firstName: lead?.split(' ')[0],
          lastName: lead?.split(' ')[1],
        });
        setCreateNewContactModalOpen(true);
      } else {
        setSelectedLead(lead);
        setLinkToContactModalOpen(true);
        handleClose();
      }
    },
    [selectedLead, handleClose]
  );

  const handleSaveNewContact = useCallback(
    async lead => {
      const payload = {
        ...quickQuoteLeadDetails,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead?.phone ? getFormattedPhone(lead?.phone) : null,
        primaryCommunication: lead.primaryCommunication,
      };

      try {
        const response = await saveQuickQuoteLeadDetails(payload);
        if (response && response?.leadsId) {
          setCreateNewContactModalOpen(false);
          handlelingNavWithCallBack(response);
        } else {
          alert('Failed to save lead.');
        }
      } catch (error) {
        console.error('Error saving lead to contact:', error);
      }
    },
    [handlelingNavWithCallBack]
  );

  const handleExistingLeadLink = useCallback(async () => {
    try {
      const LEAD_ID = selectedLead?.leadId || selectedLead?.leadsId;
      const response = await existingLinkLeadToQuickQuote(
        quickQuoteLeadDetails,
        LEAD_ID
      );
      if (response && response?.leadsId) {
        setLinkToContactModalOpen(false);
        handlelingNavWithCallBack(response);
      }
    } catch (error) {
      console.error('Error saving lead to contact:', error);
    }
  }, [handlelingNavWithCallBack, selectedLead, quickQuoteLeadDetails]);

  return (
    <>
      {contactSearchModalOpen && (
        <ContactSearchModal
          open={contactSearchModalOpen}
          handleSelectedLead={handleSelectedLead}
          handleClose={handleClose}
        />
      )}
      {createNewContactModalOpen && (
        <CreateContactForm
          open={createNewContactModalOpen}
          handleClose={() => setCreateNewContactModalOpen(false)}
          newLeadDetails={selectedLead}
          handleSaveNewContact={handleSaveNewContact}
        />
      )}
      {linkToContactModalOpen && (
        <LinkToContact
          open={linkToContactModalOpen}
          handleClose={() => setLinkToContactModalOpen(false)}
          newLeadName={selectedLead?.firstName + ' ' + selectedLead?.lastName}
          handleSubmit={handleExistingLeadLink}
          isLoading={isLoadingExistingLinkLeadToQuickQuote}
        />
      )}
    </>
  );
};

export default SaveToContact;
