import React, { useState, useCallback } from "react";
import { useEffect } from "react";
import styles from "./styles.module.scss";
import clientService from "services/clientsService";
import callRecordingsService from "services/callRecordingsService";
import * as Sentry from "@sentry/react";
import { useHistory } from "react-router-dom";
import useToast from "hooks/useToast";
import { useParams } from "react-router-dom";

export default function PossibleMatches({ phone }) {
  const [matches, setMatches] = useState([]);
  const { callLogId, callFrom } = useParams();

  const addToast = useToast();
  const history = useHistory();

  useEffect(() => {
    const getContacts = async () => {
      const toString = phone.toString();
      const number = toString?.slice(2, phone.length);
      try {
        const response = await clientService.getList(
          undefined,
          undefined,
          ["Activities.CreateDate:desc"],
          number
        );

        if (response && response?.result.length > 0) {
          let sorted = response?.result?.sort((a, b) =>
            a.firstName.localeCompare(b.firstName)
          );
          setMatches(sorted);
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    };
    getContacts();
  }, [phone]);

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
        if (callLogId) {
          await callRecordingsService.assignsLeadToInboundCallRecord({
            callLogId,
            leadId: contact.leadsId,
          });
          addToast({
            message: "Contact linked succesfully",
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
          {matches &&
            matches.map((contact, index) => {
              return (
                <div
                  className={styles.matchItem}
                  key={`matchItem-${index}`}
                  onClick={() => onClickHandler(contact)}
                >
                  {`${contact?.firstName} ${contact.lastName}`}
                </div>
              );
            })}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
