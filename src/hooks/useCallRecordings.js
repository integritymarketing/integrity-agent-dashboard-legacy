import { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import useUserProfile from "hooks/useUserProfile";
import callRecordingsService from "services/callRecordingsService";

export default () => {
  const userProfile = useUserProfile();
  const [callRecordings, setCallRecordings] = useState([]);
  const { npn } = userProfile;

  useEffect(() => {
    const getCallRecordings = async () => {
      try {
        const response =
          await callRecordingsService.getAllCallRecordingsByAgent();
        setCallRecordings(response);
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    getCallRecordings();
    const intervalId = setInterval(getCallRecordings, 15_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [npn, setCallRecordings]);

  return callRecordings;
};
