import { useState, useEffect, useCallback } from "react";
import { useClientServiceContext } from "services/clientServiceProvider";
import useUserProfile from "./useUserProfile";

const useAgentInformationByID = () => {
  const { agentId } = useUserProfile();
  const { clientsService } = useClientServiceContext();
  const [agentInfomration, setAgentInfomration] = useState({});

  const getAgentAvailability = useCallback(async () => {
    const response = await clientsService.getAgentAvailability(agentId);
    setAgentInfomration({ ...response });
  }, [setAgentInfomration, clientsService, agentId]);

  useEffect(() => {
    clientsService && getAgentAvailability();
  }, [getAgentAvailability, clientsService]);

  return {
    agentInfomration,
    getAgentAvailability,
  };
};

export default useAgentInformationByID;
