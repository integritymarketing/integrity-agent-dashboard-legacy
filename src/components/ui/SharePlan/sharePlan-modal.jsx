import React, { useState, useMemo, useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import Media from 'react-media';
import analyticsService from 'services/analyticsService';
import useUserProfile from 'hooks/useUserProfile';
import useToast from 'hooks/useToast';
import Modal from 'components/ui/modal';
import CheckboxGroup from 'components/ui/CheckboxGroup';
import CompactPlanCard from '../PlanCard/compact';
import { Button } from '../Button';
import { useNavigate } from 'react-router-dom';
import useAgentInformationByID from 'hooks/useAgentInformationByID';
import { useClientServiceContext } from 'services/clientServiceProvider';
import ShareInputsValidator from 'components/ShareInputsValidator';
import { Box, Typography } from '@mui/material';
import './styles.scss';

export const __formatPhoneNumber = phoneNumberString => {
  const originalInput = phoneNumberString;
  const cleaned = `${phoneNumberString}`.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  if (cleaned === '') {
    return null;
  }

  return originalInput;
};

const SharePlanModal = ({
  modalOpen,
  planData = {},
  handleCloseModal,
  contact = {},
  enrollmentId,
  ispolicyShare = false,
  enrollData = {},
  isApplyProcess,
  linkToExistContactId,
  defaultNavPath,
}) => {
  const showToast = useToast();
  const navigate = useNavigate();
  const {
    agentInformation: { agentVirtualPhoneNumber, agentPurl },
  } = useAgentInformationByID();

  const {
    firstName,
    lastName,
    emails,
    phones,
    leadsId,
    birthdate,
    agentNpn,
    middleName,
    addresses,
  } = contact || {};

  const { planRating = '', id, documents = [] } = planData || {};
  const addressData = addresses?.length > 0 ? addresses?.[0] : null;
  const countyFIPS =
    addressData && addressData?.countyFIPS ? addressData?.countyFIPS : '';
  const state =
    addressData && addressData?.stateCode ? addressData?.stateCode : '';

  const zipCode =
    addressData && addressData.postalCode ? addressData?.postalCode : '';

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isDocumentsSelected, setIsDocumentsSelected] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newSelectedType, setNewSelectedType] = useState('email');
  const [existingSendType, setExistingSendType] = useState('');
  const leadEmail = emails?.find(({ leadEmail }) => leadEmail)?.leadEmail ?? '';
  const leadPhone = phones?.find(({ leadPhone }) => leadPhone)?.leadPhone ?? '';

  const [isEmailCompatabile, setIsEmailCompatabile] = useState(false);
  const [isPhoneCompatabile, setIsPhoneCompatabile] = useState(false);

  const nonFormatPhoneNumber = useMemo(
    () => (phone ? `${phone}`.replace(/\D/g, '') : ''),
    [phone]
  );

  const userProfile = useUserProfile();
  const { plansService, enrollPlansService } = useClientServiceContext();

  useEffect(() => {
    const isEmailCompatibleStatus = emails?.find(
      ({ leadEmail }) => leadEmail
    )?.isValid;
    const isPhoneCompatibleStatus = phones?.find(
      ({ leadPhone }) => leadPhone
    )?.isSmsCompatible;

    setIsEmailCompatabile(isEmailCompatibleStatus);
    setIsPhoneCompatabile(isPhoneCompatibleStatus);
  }, [emails, phones]);

  console.log('isEmailCompatabile', isEmailCompatabile);
  console.log('isPhoneCompatabile', isPhoneCompatabile);

  const handleClose = useCallback(() => {
    if (isApplyProcess) {
      navigate(defaultNavPath);
    }
    handleCloseModal();
  }, [isApplyProcess, defaultNavPath, navigate, handleCloseModal]);

  useEffect(() => {
    if (modalOpen) {
      analyticsService.fireEvent('event-modal-appear', {
        modalName: 'Share Plans',
      });
    }
  }, [modalOpen]);

  const summaryBenfitURL = () => {
    const result = selectedDocuments.map(d => ({
      key: d.name,
      value: d.url,
    }));
    return result;
  };

  const handleCleanUp = () => {
    setNewSelectedType('email');
    setExistingSendType('');
    setEmail('');
    setPhone();
    handleClose();
    setIsDocumentsSelected(false);
    setSelectedDocuments([]);
  };

  const enroll = async () => {
    setLoading(true);
    const agentFirstName = userProfile?.firstName;
    const agentLastName = userProfile?.lastName;
    const agentEmail = userProfile?.email;
    const roles = userProfile?.roles ?? '';
    const agentPhoneNumber = agentVirtualPhoneNumber;
    const urlPathName = window?.location?.pathname;
    const shareCurrentPlanSnapshotUrl = `${
      import.meta.env.VITE_MEDICARE_ENROLL
    }/customer${urlPathName}`;
    let updatedRoles;
    if (typeof roles === 'string') {
      updatedRoles = [roles];
    } else {
      updatedRoles = roles;
    }
    try {
      const payload = {
        leadFirstName: firstName,
        leadLastName: lastName,
        agentFirstName: agentFirstName,
        agentLastName: agentLastName,
        agentPhoneNumber: agentPhoneNumber,
        agentEmail: agentEmail,
        documentationLinks: summaryBenfitURL(),
        starRatingsLink: planRating.toString(),
        roles: updatedRoles,
      };
      const sharepolicyData = {
        leadFirstName: firstName,
        leadLastName: lastName,
        agentFirstName: agentFirstName,
        agentLastName: agentLastName,
        agentPhoneNumber: agentPhoneNumber,
        agentEmail: agentEmail,
        shareCurrentPlanSnapshotUrl,
        roles: updatedRoles,
        leadId: leadsId,
        agentNpn,
        zipCode,
        state,
        countyFIPS,
        middleInitial: middleName,
        dateOfBirth: birthdate,
        EnrollmentId: enrollmentId,
        enrollData: enrollData,
        appSubmitDate: enrollData?.submittedDate,
        agentPurl,
      };
      if (existingSendType === 'email') {
        const data = {
          ...payload,
          messageDestination: leadEmail,
          messageType: 'email',
        };
        if (ispolicyShare) {
          const policyData = {
            ...sharepolicyData,
            messageDestination: leadEmail,
            messageType: 'email',
          };
          await enrollPlansService.sharePolicy(policyData);
        } else {
          await plansService.sendPlan(data, leadsId, id);
        }
      } else if (existingSendType === 'textMessage') {
        const data = {
          ...payload,
          messageDestination: leadPhone,
          messageType: 'sms',
        };
        const policyData = {
          ...sharepolicyData,
          messageDestination: leadPhone,
          messageType: 'sms',
        };
        if (ispolicyShare) {
          await enrollPlansService.sharePolicy(policyData);
        } else {
          await plansService.sendPlan(data, leadsId, id);
        }
      } else {
        if (newSelectedType === 'email') {
          const data = {
            ...payload,
            messageDestination: email,
            messageType: 'email',
          };
          if (ispolicyShare) {
            const policyData = {
              ...sharepolicyData,
              messageDestination: email,
              messageType: 'email',
            };
            await enrollPlansService.sharePolicy(policyData);
          } else {
            await plansService.sendPlan(data, leadsId, id);
          }
        } else {
          const data = {
            ...payload,
            messageDestination: nonFormatPhoneNumber,
            messageType: 'sms',
          };

          if (ispolicyShare) {
            const policyData = {
              ...sharepolicyData,
              messageDestination: nonFormatPhoneNumber,
              messageType: 'sms',
            };
            await enrollPlansService.sharePolicy(policyData);
          } else {
            await plansService.sendPlan(data, leadsId, id);
          }
        }
      }
      showToast({
        message: 'Successfully shared plan',
      });
    } catch (err) {
      Sentry.captureException(err);
      showToast({
        type: 'error',
        message: 'Failed to share plan',
      });
    } finally {
      handleCleanUp();
      setLoading(false);
    }
  };

  const isDisable = useMemo(() => {
    if (existingSendType === 'email' && leadEmail && isEmailCompatabile) {
      return true;
    } else if (
      existingSendType === 'textMessage' &&
      leadPhone &&
      isPhoneCompatabile
    ) {
      return true;
    } else if (existingSendType === 'newEmailOrMobile') {
      if (newSelectedType === 'email' && email) {
        return true;
      } else if (newSelectedType === 'mobile' && phone) {
        return true;
      }
    }
  }, [
    existingSendType,
    leadEmail,
    leadPhone,
    newSelectedType,
    email,
    phone,
    isPhoneCompatabile,
    isEmailCompatabile,
  ]);

  const handleOnDocumentChange = e => {
    const { checked, value: name } = e.target;
    const value = documents.filter(document => document.name === name)[0];
    const result = checked
      ? [...selectedDocuments, value]
      : selectedDocuments.filter(document => document.name !== value.name);
    setSelectedDocuments(result);
  };

  const handleContinue = e => {
    e.preventDefault();
    setIsDocumentsSelected(true);
  };

  return (
    <Media
      queries={{
        mobile: '(min-width: 320px) and (max-width: 480px)',
      }}
    >
      {matches => (
        <>
          {modalOpen && (
            <Modal
              size='lg'
              open={true}
              wide
              cssClassName={'shareplan-modal'}
              onClose={handleClose}
              labeledById='sharePlan_label'
              descById='sharePlan_desc'
            >
              <div className='shareplan-modal dialog--container'>
                <div className='dialog--title '>
                  <h2
                    id='dialog_help_label'
                    className='hdg hdg--2 mb-1 mble-title'
                  >
                    Share this Plan
                  </h2>
                </div>
                {planData && <CompactPlanCard planData={planData} />}
                {isDocumentsSelected || ispolicyShare ? (
                  <ShareInputsValidator
                    leadId={leadsId}
                    title='How do you want to share this plan?'
                    existingSendType={existingSendType}
                    setExistingSendType={setExistingSendType}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                    newSelectedType={newSelectedType}
                    setNewSelectedType={setNewSelectedType}
                    isEmailCompatabile={isEmailCompatabile}
                    setIsEmailCompatabile={setIsEmailCompatabile}
                    isPhoneCompatabile={isPhoneCompatabile}
                    setIsPhoneCompatabile={setIsPhoneCompatabile}
                  />
                ) : (
                  <div className='document-wrapper'>
                    <div className={'shareplan-label'}>
                      What documents do you want to share?
                    </div>
                    <CheckboxGroup
                      checkboxes={documents.map((document, index) => {
                        return {
                          label:
                            planData.carrierName === 'Aetna Medicare'
                              ? document.linkName
                              : document.name,
                          id: document.linkName,
                          name: 'documents',
                          checked:
                            selectedDocuments.filter(item => item === document)
                              ?.length > 0
                              ? true
                              : false,
                          value: document.name,
                          onChange: handleOnDocumentChange,
                        };
                      })}
                    />
                  </div>
                )}
                {existingSendType === 'newEmailOrMobile' && (
                  <Box>
                    <Typography variant='body2' color='#434A51' marginTop={0.5}>
                      *This{' '}
                      {newSelectedType === 'mobile' ? 'phone number' : 'email'}{' '}
                      will not be saved to the contact.
                    </Typography>
                  </Box>
                )}
                <div className={'footer'}>
                  {isDocumentsSelected || ispolicyShare ? (
                    <Button
                      label='Share'
                      data-gtm='button-share'
                      onClick={enroll}
                      disabled={!isDisable || loading}
                    />
                  ) : (
                    <Button
                      label='Continue'
                      data-gtm='button-continue'
                      onClick={handleContinue}
                      disabled={selectedDocuments.length === 0}
                    />
                  )}
                  <Button
                    className={'cancel-button'}
                    fullWidth={matches.mobile}
                    data-gtm='button-cancel'
                    label={'Cancel'}
                    onClick={handleCleanUp}
                    type='secondary'
                  />
                </div>
              </div>
            </Modal>
          )}
        </>
      )}
    </Media>
  );
};

export default SharePlanModal;
