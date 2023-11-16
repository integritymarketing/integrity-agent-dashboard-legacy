import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import clientsService from "services/clientsService";
import callRecordingsService from "services/callRecordingsService";
import useToast from "hooks/useToast";
import styles from "./styles.module.scss";

export default function PossibleMatches({ phone }) {
    const [matches, setMatches] = useState([]);
    const { callLogId, callFrom } = useParams();
    const navigate = useNavigate();
    const showToast = useToast();
    const callLogIdNumber = Number(callLogId);

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
                    const sorted = response?.result?.sort((a, b) => a.firstName.localeCompare(b.firstName));
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
            return clientsService.updateLeadPhone(contact, callFrom);
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
                if (callLogIdNumber) {
                    await callRecordingsService.assignsLeadToInboundCallRecord({
                        callLogIdNumber,
                        leadId: contact.leadsId,
                    });
                    showToast({
                        message: "Contact linked successfully",
                    });
                    navigate(`/contact/${contact.leadsId}`);
                }
            } catch (error) {
                showToast({
                    type: "error",
                    message: `${error.message}`,
                });
            }
        },
        [navigate, callLogIdNumber, showToast, updatePrimaryContact]
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
