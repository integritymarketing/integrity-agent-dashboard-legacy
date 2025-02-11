import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import Media from "react-media";

import { useLeadDetails, useCallsHistory } from "providers/ContactDetails/ContactDetailsContext";
import useOutboundCall from "hooks/useOutboundCall";
import useAnalytics from "hooks/useAnalytics";
import WithLoader from "components/ui/WithLoader";
import { CallScriptModal } from "packages/CallScriptModal";

import CallCard from "./CallCard/CallCard";
import { Box, Typography, Button } from "@mui/material";
import PlusIcon from "components/icons/plus";
import styles from "./CallsContainerTab.module.scss";

const CallsContainerTab = () => {
    const { leadId } = useParams();
    const { leadDetails } = useLeadDetails();
    const leadPhone = leadDetails.phones?.find(p => p?.leadPhone && !p?.inactive)?.leadPhone;
    const { getCallsList, setCallsToViewed, callsList = [], isLoadingCallsList } = useCallsHistory();
    const { isCallScriptOpen, setIsCallScriptOpen, initiateCall } = useOutboundCall();
    const { fireEvent } = useAnalytics();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (callsList.length) setCallsToViewed();
    }, [callsList]);

    const handleCall = useCallback(() => {
        initiateCall(leadId, leadPhone);
        fireEvent("Connect Communication Sent", {
            communicationMethod: "call",
            leadId: leadId,
        });
    }, [leadId, leadPhone, fireEvent]);

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <WithLoader isLoading={isLoadingCallsList}>
                <Media
                    query={"(max-width: 540px)"}
                    onChange={() => setIsMobile(isMobile)}
                />
                <Box className={styles.callHistoryContainer}>
                    <div className={`${isMobile ? styles.columnView : ""} ${styles.callHistoryTitleHeader}`}>
                        <Typography variant="body1" className={styles.callCountTitle}>
                            {callsList.length} Call{callsList.length != 1 && "s"}
                        </Typography>
                        <div className={styles.makeCallButtonWrapper}>
                            <Button
                                color="primary"
                                size="small"
                                variant="contained"
                                endIcon={<PlusIcon strokeColor="#FFFFFF" />}
                                className={styles.makeCallButton}
                                onClick={handleCall}
                            >
                                <span className={styles.makeCallButtonLabel}>
                                    Make a call
                                </span>
                            </Button>
                        </div>
                    </div>
                    {callsList?.length > 0 && callsList?.map(call => <CallCard key={call.callLogId} call={call} isMobile={isMobile} />)}
                </Box>
            </WithLoader>
            {isCallScriptOpen &&
                <CallScriptModal
                    modalOpen={isCallScriptOpen}
                    handleClose={() => {
                        setIsCallScriptOpen(false);
                        getCallsList(leadId);
                    }}
                    leadId={leadId}
                    countyFips={leadDetails?.addresses?.[0]?.countyFips}
                    postalCode={leadDetails?.addresses?.[0]?.postalCode}
                />
            }
        </Box>
    )
}

export default CallsContainerTab;
