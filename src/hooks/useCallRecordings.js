import { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import callRecordingsService from "services/callRecordingsService";

export default ({ subscribe = true } = {}) => {
  const [callRecordings, setCallRecordings] = useState([]);

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
    if (subscribe) {
      const intervalId = setInterval(getCallRecordings, 15_000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [setCallRecordings]);

  return callRecordings;
};
