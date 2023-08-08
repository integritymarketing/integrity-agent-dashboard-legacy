import { useState, useEffect, useCallback } from "react";
import { useClientServiceContext } from "services/clientServiceProvider";
import useUserProfile from "./useUserProfile";

const useAgentInformationByID = () => {
  const { agentId } = useUserProfile();
  const { callRecordingsService } = useClientServiceContext();
  const [agentInfomration, setAgentInfomration] = useState({});

  const getAgentAvailability = useCallback(async () => {
    const response = await callRecordingsService.getAgentAvailability(agentId);
    setAgentInfomration({ ...response });
  }, [setAgentInfomration, callRecordingsService, agentId]);

  useEffect(() => {
    callRecordingsService && getAgentAvailability();
  }, [getAgentAvailability, callRecordingsService]);

  return {
    agentInfomration,
    getAgentAvailability,
  };
};

export default useAgentInformationByID;
