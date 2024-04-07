import { Box } from "@mui/material";
import { ConnectPhone } from "components/icons/version-2/ConnectPhone";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import { CallScriptModal } from "packages/CallScriptModal";
import { useCallback, useState } from "react";

const LEADS_API_VERSION = "v2.0";
const NOT_AVAILABLE = "N/A";

const ConnectCall = ({ row }) => {
    const { phones = [], addresses = [], leadTags = [], statusName = "", leadsId } = row;
    const { agentInformation } = useAgentInformationByID();
    const validPhones = phones.filter((phone) => phone?.leadPhone);
    const phone = validPhones.length > 0 ? validPhones?.[0]?.leadPhone : NOT_AVAILABLE;
    const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
    const { agentID, callForwardNumber, agentVirtualPhoneNumber, agentNPN } = agentInformation;
    const showToast = useToast();
    const { Post: outboundCallFromMedicareCenter } = useFetch(
        `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Call/CallCustomer`
    );

    const formattedPhoneNumber = agentVirtualPhoneNumber?.replace(/^\+1/, "");


    const handleCall = useCallback(async () => {
        if (phone !== NOT_AVAILABLE) {
            const payload = {
                agentId: agentID,
                leadId: leadsId,
                agentTwilioNumber: formattedPhoneNumber,
                agentPhoneNumber: callForwardNumber,
                customerNumber: phone,
                agentNPN,
            };
            try {
                await outboundCallFromMedicareCenter(payload);
                showToast({
                    type: "success",
                    message: "Call Initiated Successfully",
                });
                setIsScriptModalOpen(true);
                fireEvent("Outbound Call", {
                    leadid: leadId,
                    tags: leadTags,
                    stage: statusName,
                    plan_enroll_profile_created,
                });
            } catch (error) {
                showToast({
                    type: "error",
                    message: "Error initiating call. Please try again.",
                });
            }
        }
    }, [
        agentID,
        callForwardNumber,
        formattedPhoneNumber,
        agentNPN,
        phone,
        outboundCallFromMedicareCenter,
        showToast,
        setIsScriptModalOpen,
    ]);

    return <>
        <Box position="relative" display="inline-block" onClick={handleCall}>
            <ConnectPhone />
        </Box >
        {isScriptModalOpen && (
            <CallScriptModal
                modalOpen={isScriptModalOpen}
                handleClose={() => setIsScriptModalOpen(false)}
                leadId={leadsId}
                countyFips={addresses?.[0]?.countyFips}
                postalCode={addresses?.[0]?.postalCode}
            />
        )}

    </>
}

export default ConnectCall;