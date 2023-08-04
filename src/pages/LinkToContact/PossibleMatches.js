import React, { useState, useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { useClientServiceContext } from "services/clientServiceProvider";
import callRecordingsService from "services/callRecordingsService";
import useToast from "hooks/useToast";
import styles from "./styles.module.scss";

export default function PossibleMatches({ phone }) {
  const { clientsService } = useClientServiceContext();
  const [matches, setMatches] = useState([]);
  const { callLogId, callFrom } = useParams();
  const history = useHistory();
  const addToast = useToast();

  useEffect(() => {
    const getContacts = async () => {
      const number = phone.toString().slice(2, phone.length);
      try {
        const response = await clientsService.getList(
          undefined,
          undefined,
          ["Activities.CreateDate:desc"],
          number
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
  }, [phone, clientsService]);

  const updatePrimaryContact = useCallback(
    (contact) => {
      return clientsService.updateLeadPhone(contact, callFrom);
    },
    [callFrom, clientsService]
  );

  const onClickHandler = useCallback(
    async (contact) => {
      try {
        const reverseArray = contact?.phones?.reverse();
        const hasPhone = reverseArray[0]?.leadPhone;
        if (!hasPhone) {
          await updatePrimaryContact(contact);
        }
        if (callLogId) {
          await callRecordingsService.assignsLeadToInboundCallRecord({
            callLogId,
            leadId: contact.leadsId,
          });
          addToast({
            message: "Contact linked successfully",
          });
          history.push(`/contact/${contact.leadsId}`);
        }
      } catch (error) {
        addToast({
          type: "error",
          message: `${error.message}`,
        });
      }
    },
    [history, callLogId, addToast, updatePrimaryContact]
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
