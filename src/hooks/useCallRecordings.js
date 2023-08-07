import { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { useClientServiceContext } from "services/clientServiceProvider";
import { getSignalRConnection } from "hooks/signalRConnection";
import useUserProfile from "hooks/useUserProfile";

export default function useCallRecordings() {
  const { callRecordingsService } = useClientServiceContext();
  const [callRecordings, setCallRecordings] = useState([]);
  const { agentId } = useUserProfile();

  useEffect(() => {
    async function fetchCallRecordings() {
      try {
        const recordings = await callRecordingsService.getAllCallRecordingsByAgent();

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

    fetchCallRecordings();

    const connection = getSignalRConnection(agentId);

    function handleActiveCall(status) {
      setTimeout(fetchCallRecordings, status ? 5000 : 15000);
    }

    connection.on("ActiveCall", handleActiveCall);

    return () => {
      connection.off("ActiveCall", handleActiveCall);
    };
  }, [agentId, callRecordingsService]);

  return callRecordings;
}
