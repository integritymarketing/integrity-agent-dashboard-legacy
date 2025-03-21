import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import styles from './styles.module.scss';
import { useClientServiceContext } from 'services/clientServiceProvider';
import useToast from 'hooks/useToast';
import useAnalytics from 'hooks/useAnalytics';
import { useContactListAPI } from 'providers/ContactListAPIProviders';

export default function PossibleMatches({ phone, policyHolder, state }) {
  const [matches, setMatches] = useState([]);
  const { callFrom } = useParams();
  const navigate = useNavigate();
  const { fireEvent } = useAnalytics();
  const showToast = useToast();
  const { clientsService, enrollPlansService } = useClientServiceContext();
  const { getLeadsList } = useContactListAPI();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await getLeadsList(
          1,
          25,
          ['Activities.CreateDate:desc'],
          policyHolder
        );
        if (response && response?.result.length > 0) {
          const sorted = response?.result?.sort((a, b) =>
            a.firstName.localeCompare(b.firstName)
          );
          setMatches(sorted);
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    };
    getContacts();
  }, [getLeadsList, phone, policyHolder, state]);

  const updatePrimaryContact = useCallback(
    contact => {
      return clientsService.updateLeadPhone(contact, callFrom);
    },
    [callFrom, clientsService]
  );

  const onClickHandler = useCallback(
    async contact => {
      try {
        const hasPhone = contact?.phones?.slice().reverse()[0]?.leadPhone;
        if (!hasPhone) {
          await updatePrimaryContact(contact);
        }

        const {
          policyEffectiveDate,
          planId,
          submittedDate,
          policyId,
          agentNpn,
          carrier,
          consumerSource,
          policyStatus,
          hasPlanDetails,
          confirmationNumber,
          policyHolder,
          sourceId,
          linkingType,
        } = state;

        const leadDate = contact.emails[0]?.createDate;

        const updateBusinessBookPayload = {
          agentNpn,
          leadId: contact?.leadsId?.toString(),
          policyNumber: policyId,
          plan: planId,
          carrier,
          policyStatus,
          consumerSource,
          confirmationNumber,
          policyHolder,
          policyEffectiveDate,
          appSubmitDate: submittedDate,
          hasPlanDetails,
          sourceId,
          leadDate,
          leadStatus: '',
          linkingType,
        };

        const response = await enrollPlansService.updateBookOfBusiness(
          updateBusinessBookPayload
        );

        if (response) {
          showToast({
            message: 'Contact linked successfully',
          });
          fireEvent('Call Linked', {
            leadid: contact.leadsId,
          });
          navigate(`/contact/${contact.leadsId}`);
        } else {
          showToast({
            type: 'error',
            message: `${response}`,
          });
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: `${error.message}`,
        });
      }
    },
    [
      state,
      enrollPlansService,
      updatePrimaryContact,
      showToast,
      fireEvent,
      navigate,
    ]
  );

  if (matches?.length > 0) {
    return (
      <div className={styles.possibleMatch}>
        <div className={styles.title}>Possible Matches</div>
        <div className={styles.matchList}>
          {matches.map((contact, index) => (
            <div
              className={styles.matchItem}
              key={`matchItem-${index}`}
              onClick={() => onClickHandler(contact)}
            >
              {`${contact?.firstName} ${contact.lastName}`}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
