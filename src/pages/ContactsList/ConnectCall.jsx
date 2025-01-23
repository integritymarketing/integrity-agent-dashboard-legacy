import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { ConnectPhone } from "components/icons/version-2/ConnectPhone";
import { CallScriptModal } from "packages/CallScriptModal";
import { useCallback, useState } from "react";
import useAnalytics from "hooks/useAnalytics";
import useOutboundCall from "hooks/useOutboundCall";

const ConnectCall = ({ row, view }) => {
    const { phones = [], addresses = [], leadsId } = row;
    const { fireEvent } = useAnalytics();
    const leadPhone = phones.find(p => p?.leadPhone && !p?.inactive)?.leadPhone;
    const { isCallScriptOpen, setIsCallScriptOpen, initiateCall } = useOutboundCall();

    const handleCall = useCallback(async () => {
        if (!leadPhone) return;
        const wasSuccessful = await initiateCall(leadsId, leadPhone);
        if (wasSuccessful) {
            fireEvent("Contact List Tag Viewed", {
                leadid: row.leadsId,
                view,
                tag_category: "connect",
                content: "phone_number",
            });
        }
    }, [
        initiateCall,
        leadPhone,
        leadsId,
        fireEvent
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
            {isCallScriptOpen && (
                <CallScriptModal
                    modalOpen={isCallScriptOpen}
                    handleClose={() => setIsCallScriptOpen(false)}
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
