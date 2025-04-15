import * as Sentry from '@sentry/react';
import React, { useCallback, useState } from 'react';

import useAnalytics from 'hooks/useAnalytics';
import useToast from 'hooks/useToast';
import { PLAN_TYPE_ENUMS } from '../../../constants';
import { useNavigate } from 'react-router-dom';

import Radio from 'components/ui/Radio';
import Modal from 'components/ui/modal';

import { useClientServiceContext } from 'services/clientServiceProvider';
import { useLeadDetails } from 'providers/ContactDetails';

import './styles.scss';

import { Button } from '../Button';
import CompactPlanCard from '../PlanCard/compact';

const EnrollmentModal = ({
  modalOpen,
  planData,
  handleCloseModal,
  contact,
  effectiveDate,
  isApplyProcess,
  linkToExistContactId,
  navPath,
  defaultNavPath,
}) => {
  const [option, setOption] = useState('');
  const showToast = useToast();
  const { fireEvent } = useAnalytics();

  const { enrollPlansService } = useClientServiceContext();
  const navigate = useNavigate();
  const { getLeadDetailsAfterSearch } = useLeadDetails();

  const enroll = useCallback(
    async responseContact => {
      const contactData = responseContact || contact;
      const leadId = responseContact?.leadsId || contact?.leadsId;

      fireEvent('Health Submitted CTA Clicked', {
        leadid: leadId,
        line_of_business: 'Health',
        product_type: PLAN_TYPE_ENUMS[planData?.planType]?.toLowerCase(),
        selection:
          option === 'send'
            ? 'client_application_selected'
            : 'agent_application_selected',
      });

      const { medicareBeneficiaryID: mbi } = contactData;

      try {
        const enrolled = await enrollPlansService.enroll(leadId, planData.id, {
          enrollRequest: {
            firstName: contactData?.firstName || '',
            middleInitial:
              contactData?.middleName?.length > 1
                ? contactData.middleName[0]
                : '',
            lastName: contactData?.lastName || '',
            dateOfBirth: contactData?.birthdate || null,
            address1: contactData && contactData?.addresses?.[0]?.address1,
            address2: contactData && contactData?.addresses?.[0]?.address2,
            city: contactData && contactData?.addresses?.[0]?.city,
            state: contactData && contactData?.addresses?.[0]?.stateCode,
            zip: contactData && contactData?.addresses?.[0]?.postalCode,
            countyFIPS: contactData && contactData?.addresses?.[0]?.countyFips,
            phoneNumber:
              contactData && contactData?.phones?.length > 0
                ? contactData?.phones[0]?.leadPhone
                : null,
            email:
              contactData && contactData?.emails?.length > 0
                ? contactData?.emails[0]?.leadEmail
                : null,
            sendToBeneficiary: option === 'send',
            effectiveDate: effectiveDate,
            mbi: mbi || null,
          },
          planDetail: planData,
        });

        if (enrolled && enrolled.url) {
          if (isApplyProcess) {
            if (defaultNavPath) {
              navigate(defaultNavPath);
            } else {
              navigate(`/plans/${leadId}${navPath ? navPath : ''}`);
            }
          }
          window.open(enrolled.url, '_blank').focus();
          showToast({
            type: 'success',
            message: 'Successfully Sent to Client',
          });
        } else {
          if (isApplyProcess) {
            if (defaultNavPath) {
              navigate(defaultNavPath);
            } else {
              navigate(`/plans/${leadId}${navPath ? navPath : ''}`);
            }
          }
          showToast({
            type: 'error',
            message: 'There was an error enrolling the contact.',
          });
        }
      } catch (e) {
        Sentry.captureException(e);
        showToast({
          type: 'error',
          message: 'There was an error enrolling the contact.',
        });
      } finally {
        handleCloseModal();
      }
    },
    [
      fireEvent,
      contact,
      planData,
      option,
      enrollPlansService,
      effectiveDate,
      showToast,
      handleCloseModal,
    ]
  );

  const preEnroll = useCallback(async () => {
    if (isApplyProcess) {
      const response = await getLeadDetailsAfterSearch(linkToExistContactId);
      if (response) {
        await enroll(response);
      }
    } else {
      await enroll();
    }
  }, [linkToExistContactId, enroll, getLeadDetailsAfterSearch]);

  return (
    <React.Fragment>
      {modalOpen && (
        <Modal
          open={true}
          wide
          cssClassName={'enrollment-modal'}
          onClose={() => handleCloseModal()}
          labeledById='enroll_label'
          descById='enroll_desc'
        >
          <div className='enrollment-modal dialog--container'>
            <div className='dialog--title '>
              <h2 id='dialog_help_label' className='hdg hdg--2 mb-1 mble-title'>
                Enroll in Plan
              </h2>
            </div>
            {planData && <CompactPlanCard planData={planData} />}
            <div className={'enrollment-label'}>
              How will you be completing this form?
            </div>
            <Radio
              name={'enrollModal'}
              htmlFor={'send'}
              id={'send'}
              label={`Phone/Virtual Appointment (send link to beneficiary to sign and submit)`}
              checked={option === 'send'}
              onChange={() => setOption('send')}
            />
            <Radio
              name={'enrollModal'}
              htmlFor={'complete'}
              id={'complete'}
              label={`Face-to-face Appointment ONLY (agent may submit)`}
              checked={option === 'complete'}
              onChange={() => setOption('complete')}
            />
            <div className={'footer'}>
              <Button
                label={'Continue'}
                onClick={preEnroll}
                disabled={!option}
              />
              <Button
                label={'Cancel'}
                onClick={handleCloseModal}
                type='secondary'
              />
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default EnrollmentModal;
