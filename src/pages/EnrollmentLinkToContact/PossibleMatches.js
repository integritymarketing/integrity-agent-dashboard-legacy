import React, { useState, useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import clientService from "services/clientsService";
import enrollPlansService from "services/enrollPlansService";
import useToast from "hooks/useToast";
import styles from "./styles.module.scss";
export default function PossibleMatches({ phone, policyHolder, state }) {
  const [matches, setMatches] = useState([]);
  const { callFrom } = useParams();
  const history = useHistory();
  const addToast = useToast();
  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await clientService.getList(
          1,
          25,
          ["Activities.CreateDate:desc"],
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
  }, [phone, policyHolder]);

  const updatePrimaryContact = useCallback(
    (contact) => {
      return clientService.updateLeadPhone(contact, callFrom);
    },
    [callFrom]
  );

  const onClickHandler = useCallback(
    async (contact) => {
      try {
        const reverseArray = contact?.phones?.reverse();
        const hasPhone = reverseArray[0]?.leadPhone;
        if (!hasPhone) {
          await updatePrimaryContact(contact);
        }

        const {
          effectiveDate,
          planId,
          submittedDate,
          policyId,
          agentNpn,
          carrier,
          consumerSource,
          policyStatus,
          leadId,
          hasPlanDetails,
          confirmationNumber,
          policyHolder,
        } = state;

        const updateBusinessBookPayload = {
          agentNpn: agentNpn,
          leadId: leadId,
          policyNumber: policyId,
          plan: planId,
          carrier: carrier,
          policyStatus: policyStatus,
          consumerSource: consumerSource,
          confirmationNumber: confirmationNumber,
          consumerFirstName: policyHolder.split(" ")[0],
          consumeLastName: policyHolder.split(" ")[1],
          policyEffectiveDate: effectiveDate,
          appSubmitDate: submittedDate,
          hasPlanDetails: hasPlanDetails,
          policySourceId: "10000000",
          leadDate: contact.emails[0].createDate,
          leadStatus: '',
        };

        const response = await enrollPlansService.updateBookOfBusiness(
          updateBusinessBookPayload
        );

        if (response.agentNpn) {
          addToast({
            message: "Contact linked succesfully",
          });
          history.push(`/contact/${contact.leadsId}`);
        }else {

          addToast({
            type: "error",
            message: `${response}`,
          });
        }
      } catch (error) {
        addToast({
          type: "error",
          message: `${error.message}`,
        });
      }
    },
    [history, addToast, updatePrimaryContact, state]
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
