import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {useCallRecordingsService} from "services/callRecordingsService";

export default () => {
  const auth = useAuth0();
  const [agentInfomration, setAgentInfomration] = useState({});
  const callRecordingsService = useCallRecordingsService();

  const getAgentAvailability = useCallback(async () => {
    const user = await auth.user;
    const { agentid } = user;
    const response = await callRecordingsService.getAgentAvailability(agentid);
    setAgentInfomration({ ...response });
  }, [setAgentInfomration, auth, callRecordingsService]);

  useEffect(() => {
    callRecordingsService && getAgentAvailability();
  }, [getAgentAvailability, callRecordingsService]);

  return {
    agentInfomration,
    getAgentAvailability,
  };
};
