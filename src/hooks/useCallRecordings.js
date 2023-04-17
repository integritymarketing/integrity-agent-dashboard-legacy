import { useState, useEffect, useContext } from "react";
import * as Sentry from "@sentry/react";
import callRecordingsService from "services/callRecordingsService";
import { getSignalRConnection } from "hooks/signalRConnection";
import AuthContext from "contexts/auth";

export default function useCallRecordings() {
  const [callRecordings, setCallRecordings] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    async function fetchCallRecordings() {
      try {
        let response =
          await callRecordingsService.getAllCallRecordingsByAgent();

        if (response.length > 0) {
          response = response.sort(
            (a, b) => new Date(b.callStartTime) - new Date(a.callStartTime)
          );
        }

        setCallRecordings(response);
      } catch (error) {
        Sentry.captureException(error);
      }
    }

    fetchCallRecordings();

    if (auth.isAuthenticated()) {
      const connection = getSignalRConnection(auth.userProfile?.agentid);

      function handleActiveCall(status) {
        setTimeout(fetchCallRecordings, status ? 5000 : 15000);
      }

      connection.on("ActiveCall", handleActiveCall);

      return () => {
        connection.off("ActiveCall", handleActiveCall);
      };
    }
  }, [setCallRecordings, auth]);

  return callRecordings;
}
