import React, { useMemo, useCallback, useState } from "react";
import * as Sentry from "@sentry/react";
import { formatPhoneNumber } from "utils/phones";
import { useClientServiceContext } from "services/clientServiceProvider";
import styles from "./ContactsPage.module.scss";
import useToast from "hooks/useToast";
import { CallScriptModal } from "packages/CallScriptModal";
import useUserProfile from "hooks/useUserProfile";

export default function PrimaryContactPhone({ countyFips, postalCode, phone, leadsId }) {
    const userProfile = useUserProfile();
    const showToast = useToast();
    const [modalOpen, setModalOpen] = useState(false);
    const { npn, agentId } = userProfile;
    const { clientsService, callRecordingsService } = useClientServiceContext();

    const getAgentAvailability = async function () {
        try {
            const data = await clientsService.getAgentAvailability(agentId);
            return data;
        } catch (error) {
            Sentry.captureException(error);
            return null;
        }
    };

    const getAgentByAgentId = async function () {
        try {
            const data = await clientsService.getAgentByAgentId(agentId);
            return data;
        } catch (error) {
            Sentry.captureException(error);
            return null;
        }
    };

    const formatContactNumber = useMemo(() => formatPhoneNumber(phone), [phone]);

    const onPhoneClickHandler = useCallback(
        async (event) => {
            let agentCallForwardingNumber;
            event.preventDefault();
            try {
                const agentData = await getAgentAvailability();
                if (!agentData?.callForwardNumber) {
                    const agentDataById = await getAgentByAgentId();
                    agentCallForwardingNumber = agentDataById.callForwardNumber;
                }
                const formattedPhoneNumber = agentData?.agentVirtualPhoneNumber?.replace(/^\+1/, "");
                const payload = {
                    agentId: agentData?.agentID,
                    leadId: `${leadsId}`,
                    agentTwilioNumber: formattedPhoneNumber,
                    agentPhoneNumber: agentData.callForwardNumber || agentCallForwardingNumber,
                    customerNumber: phone,
                    agentNPN: npn,
                };
                await callRecordingsService.outboundCallFromMedicareCenter(payload);
                showToast({
                    type: "success",
                    message: "Call Intiated Successfully",
                });
                setModalOpen(true);
            } catch (error) {
                Sentry.captureException(error);
                showToast({
                    type: "error",
                    message: "There was an error please try again.",
                });
                setModalOpen(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [npn]
    );

    return (
        <>
            {modalOpen && (
                <CallScriptModal
                    modalOpen={modalOpen}
                    handleClose={() => setModalOpen(false)}
                    leadId={leadsId}
                    countyFips={countyFips}
                    postalCode={postalCode}
                />
            )}
            <a href={() => false} className={styles.link} onClick={onPhoneClickHandler}>
                {formatContactNumber}
            </a>
        </>
    );
}
