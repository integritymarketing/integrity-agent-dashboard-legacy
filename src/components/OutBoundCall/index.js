import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { CallScriptModal } from "packages/CallScriptModal";
import { useCallback } from "react";
import useAnalytics from "hooks/useAnalytics";
import useOutboundCall from "hooks/useOutboundCall";
import { formatPhoneNumber } from "utils/phones";
import styles from "./styles.module.scss";

const OutBoundCall = ({ leadPhone, view }) => {
    const { fireEvent } = useAnalytics();
    const { isCallScriptOpen, setIsCallScriptOpen, initiateCall } = useOutboundCall();

    const handleCall = useCallback(async () => {
        if (!leadPhone) return;
        const wasSuccessful = await initiateCall(null, leadPhone);
        if (wasSuccessful) {
            fireEvent("Contact List Tag Viewed", {
                view,
                tag_category: "connect",
                content: "phone_number",
            });
        }
    }, [initiateCall, leadPhone, fireEvent]);

    return (
        <>
            <Box onClick={handleCall}>
                <Typography variant={view === "linkToContact" ? "h2" : "h4"} className={styles.phoneNumber}>
                    {formatPhoneNumber(leadPhone, true)}
                </Typography>
            </Box>
            {isCallScriptOpen && (
                <CallScriptModal modalOpen={isCallScriptOpen} handleClose={() => setIsCallScriptOpen(false)} />
            )}
        </>
    );
};
OutBoundCall.propTypes = {
    view: PropTypes.string.isRequired,
    leadPhone: PropTypes.string.isRequired,
};

export default OutBoundCall;
