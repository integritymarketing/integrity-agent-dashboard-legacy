import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { useClientServiceContext } from "services/clientServiceProvider";
import { getSignalRConnection } from "hooks/signalRConnection";
import useUserProfile from "hooks/useUserProfile";

export default function useCallRecordings() {
    const { callRecordingsService } = useClientServiceContext();
    const [callRecordings, setCallRecordings] = useState([]);
    const { agentId } = useUserProfile();
    const [fetchTimeoutId, setFetchTimeoutId] = useState(null);
    const location = useLocation();

    const isLinkToContactPath = () => {
        return location.pathname.includes("/link-to-contact");
    };

    async function fetchCallRecordings() {
        try {
            const isLinkToContact = isLinkToContactPath();
            const recordings = await callRecordingsService.getAllCallRecordingsByAgent(isLinkToContact);

            if (recordings.length > 0) {
                const sortedRecordings = recordings.sort(
                    (a, b) => new Date(b.callStartTime) - new Date(a.callStartTime)
                );
                setCallRecordings(sortedRecordings);
            } else {
                setCallRecordings([]);
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    useEffect(() => {
        function handleActiveCall(status) {
            if (status) {
                setFetchTimeoutId(setTimeout(fetchCallRecordings, 5000));
            } else {
                setFetchTimeoutId(setTimeout(fetchCallRecordings, 15000));
            }
        }

        if (agentId) {
            const connection = getSignalRConnection(agentId);

            connection.on("ActiveCall", handleActiveCall);

            return () => {
                connection.off("ActiveCall", handleActiveCall);
                clearTimeout(fetchTimeoutId);
            };
        }
    }, [agentId, fetchTimeoutId]);

    useEffect(() => {
        if (agentId) {
            fetchCallRecordings();
        }
    }, [agentId]);

    return callRecordings;
}
