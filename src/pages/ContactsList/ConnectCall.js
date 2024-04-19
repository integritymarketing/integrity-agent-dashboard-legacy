import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { ConnectPhone } from "components/icons/version-2/ConnectPhone";
import useAgentInformationByID from "hooks/useAgentInformationByID";
import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import { CallScriptModal } from "packages/CallScriptModal";
import { useCallback, useState } from "react";
import useAnalytics from "hooks/useAnalytics";

const NOT_AVAILABLE = "N/A";

const ConnectCall = ({ row, view }) => {
    const { phones = [], addresses = [], leadsId } = row;
    const { fireEvent } = useAnalytics();
    const { agentInformation } = useAgentInformationByID();
    const validPhones = phones.filter((phone) => phone?.leadPhone);
    const phone = validPhones.length > 0 ? validPhones[0].leadPhone : NOT_AVAILABLE;
    const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
    const { agentID, callForwardNumber, agentVirtualPhoneNumber, agentNPN } = agentInformation;
    const showToast = useToast();
    const { Post: outboundCallFromMedicareCenter } = useFetch(
        `${process.env.REACT_APP_COMMUNICATION_API}/Call/CallCustomer`
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
                fireEvent("Contact List Tag Viewed", {
                    leadid: row.leadsId,
                    view,
                    tag_category: "connect",
                    content: "phone_number",
                });
            } catch (error) {
                showToast({
                    type: "error",
                    message: "Error initiating call. Please try again.",
                });
            }
        }
    }, [
        phone,
        agentID,
        leadsId,
        formattedPhoneNumber,
        callForwardNumber,
        agentNPN,
        outboundCallFromMedicareCenter,
        showToast,
        fireEvent,
        row.leadsId,
        view,
    ]);

    return (
        <>
            <Box
                position="relative"
                cou
                display="inline-block"
                sx={{ left: "12px", cursor: "pointer" }}
                onClick={handleCall}
            >
                <ConnectPhone />
            </Box>
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
    );
};
ConnectCall.propTypes = {
    row: PropTypes.shape({
        phones: PropTypes.array,
        addresses: PropTypes.array,
        leadTags: PropTypes.array,
        statusName: PropTypes.string,
        leadsId: PropTypes.number.isRequired,
    }).isRequired,
    view: PropTypes.string.isRequired,
};

export default ConnectCall;
