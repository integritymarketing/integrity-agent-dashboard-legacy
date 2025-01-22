import { useState, useCallback } from "react";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useToast from "hooks/useToast";
import useFetch from "hooks/useFetch";

const useOutboundCall = () => {
    const URL = `${import.meta.env.VITE_COMMUNICATION_API}/Call/CallCustomer`;

    const { agentInformation } = useAgentInformationByID();
    const [isCallScriptOpen, setIsCallScriptOpen] = useState(false);

    const showToast = useToast();

    const { Post: initiateOutboundCall } = useFetch(URL);

    const initiateCall = useCallback(
        async (leadId, leadPhone) => {
            const payload = {
                agentId: agentInformation.agentID,
                agentTwilioNumber: agentInformation.agentVirtualPhoneNumber?.replace(/^\+1/, ""),
                agentPhoneNumber: agentInformation.callForwardNumber,
                customerNumber: leadPhone,
                agentNPN: agentInformation.agentNPN,
            };
            if (leadId) {
                payload.leadId = leadId;
            }
            try {
                await initiateOutboundCall(payload);
                showToast({
                    type: "success",
                    message: "Call Initiated Successfully",
                });
                setIsCallScriptOpen(true);
                return true;
            } catch {
                showToast({
                    type: "error",
                    message: "Error initiating call. Please try again.",
                });
                return false;
            }
        },
        [initiateOutboundCall]
    );

    return { isCallScriptOpen, setIsCallScriptOpen, initiateCall };
};

export default useOutboundCall;
