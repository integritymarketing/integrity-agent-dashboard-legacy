import { useState, useEffect, useContext } from "react";
import * as Sentry from "@sentry/react";
import callRecordingsService from "services/callRecordingsService";
import { getSignalRConnection } from "hooks/signalRConnection"; // TODO: Move this to appropriate path.
import AuthContext from "contexts/auth";

export default () => {
  const [callRecordings, setCallRecordings] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const getCallRecordings = async () => {
      try {
        let response = await callRecordingsService.getAllCallRecordingsByAgent();

        if (response.length > 0) {
          response = response?.sort(
            (a, b) => new Date(b?.callStartTime) - new Date(a?.callStartTime)
          );
        }

        setCallRecordings(response);
      } catch (error) {
        Sentry.captureException(error);
      }
    };
    getCallRecordings();
    if (auth.isAuthenticated()) {
      const connection = getSignalRConnection(auth.userProfile?.agentid);
      connection.on("ActiveCall", (status) => {
          setTimeout(getCallRecordings, status ? 5_000 : 15_000);
      });
      return () => {
        connection.off("ActiveCall");
      };
    }
  }, [setCallRecordings, auth]);

  return callRecordings;
};
