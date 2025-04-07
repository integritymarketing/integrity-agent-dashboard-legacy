import React, { useState, useCallback, useEffect } from 'react';
import ContactSearchModal from '../ContactSearchModal';
import CreateContactForm from '../CreateContactForm';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import LinkToContact from '../LinkToContact';

const SaveToContact = ({
  contactSearchModalOpen,
  handleClose,
  handleCallBack,
}) => {
  const {
    quickQuoteLeadDetails,
    saveQuickQuoteLeadDetails,
    existingLinkLeadToQuickQuote,
    isLoadingExistingLinkLeadToQuickQuote,
  } = useCreateNewQuote();

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
    [selectedLead, handleCallBack, handleClose]
  );

  const handleSaveNewContact = useCallback(
    async lead => {
      const payload = {
        ...quickQuoteLeadDetails,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead?.phone || '',
        primaryCommunication: lead.primaryCommunication,
      };
      try {
        const response = await saveQuickQuoteLeadDetails(payload);
        if (response && response?.leadsId) {
          handleCallBack(response?.leadsId);
        } else {
          alert('Failed to save lead.');
        }
      } catch (error) {
        console.error('Error saving lead to contact:', error);
      }
    },
    [handleCallBack]
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
        handleCallBack(response?.leadsId);
      }
    } catch (error) {
      console.error('Error saving lead to contact:', error);
    }
  }, [handleCallBack, selectedLead, quickQuoteLeadDetails]);

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
