import * as Sentry from "@sentry/react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";

import useAnalytics from "hooks/useAnalytics";
import useToast from "hooks/useToast";

import { useClientServiceContext } from "services/clientServiceProvider";

import styles from "./styles.module.scss";

export default function PossibleMatches({ phone, tagIds }) {
    const [matches, setMatches] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const callLogId = queryParams.get("id");
    const callFrom = queryParams.get("phoneNumber");
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();
    const showToast = useToast();
    const { clientsService, callRecordingsService } = useClientServiceContext();
    const callLogIdNumber = callLogId ? Number(callLogId) : null;

    useEffect(() => {
        const getContacts = async () => {
            const number = phone.toString().slice(2, phone.length);
            try {
                const response = await clientsService.getList(
                    null,
                    null,
                    null,
                    number,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    true,
                    null,
                    null,
                    null,
                    null,
                    null
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
                        callLogId: callLogIdNumber,
                        leadId: contact.leadsId,
                        tagIds: tagIds || [],
                        isInbound: true,
                    });
                    showToast({
                        message: "Contact linked successfully",
                    });
                    fireEvent("Call Linked", {
                        leadid: contact.leadsId,
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
        [callLogIdNumber, updatePrimaryContact, callRecordingsService, tagIds, showToast, fireEvent, navigate]
    );

    if (matches?.length > 0) {
        return (
            <div className={styles.possibleMatch}>
                <Typography variant="h4" color="#052a63">
                    Possible Matches
                </Typography>
                <div className={styles.matchList}>
                    {matches.map((contact, index) => (
                        <Box
                            key={`matchItem-${index}`}
                            className={styles.matchItem}
                            onClick={() => onClickHandler(contact)}
                        >
                            <Typography variant="body1" color="#434A51">
                                {`${contact?.firstName} ${contact.lastName}`}
                            </Typography>
                        </Box>
                    ))}
                </div>
            </div>
        );
    } else {
        return null;
    }
}
