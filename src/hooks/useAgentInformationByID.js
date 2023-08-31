import { useEffect } from "react";
import clientsService from "services/clientsService";
import useUserProfile from "./useUserProfile";

import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { agentInformationSelector } from "recoil/agent/selectors";
import { agentIdAtom, clientServiceAtom } from "recoil/agent/atoms";

const useAgentInformationByID = () => {
  const { agentId } = useUserProfile();
  const agentInformation = useRecoilValue(agentInformationSelector);
  const setClientService = useSetRecoilState(clientServiceAtom);
  const setAgentId = useSetRecoilState(agentIdAtom);

  const getAgentAvailability = useRecoilRefresher_UNSTABLE(
    agentInformationSelector
  );

  useEffect(() => {
    clientsService && setClientService(clientsService);
  }, [setClientService]);

  useEffect(() => {
    agentId && setAgentId(agentId);
  }, [agentId, setAgentId]);

  return {
    agentInformation,
    getAgentAvailability,
  };
};

export default useAgentInformationByID;
