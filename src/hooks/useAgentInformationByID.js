import { useEffect } from "react";
import clientsService from "services/clientsService";
import useUserProfile from "./useUserProfile";
import useFetch from "./useFetch";
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
  const { Post: createAgentPurl } = useFetch(
    `${process.env.REACT_APP_AGENTS_URL}/api/v1.0/Purl`
  );
  const { agentNPN, agentPurl } = agentInformation;

  const getAgentAvailability = useRecoilRefresher_UNSTABLE(
    agentInformationSelector
  );

  useEffect(() => {
    clientsService && setClientService(clientsService);
  }, [setClientService]);

  useEffect(() => {
    const createPurl = async () => {
      if (!agentPurl && agentNPN) {
        await createAgentPurl({ agentNpn: agentNPN });
      }
    };
  
    createPurl();
  }, [agentPurl, agentNPN, createAgentPurl]);

  useEffect(() => {
    agentId && setAgentId(agentId);
  }, [agentId, setAgentId]);

  return {
    agentInformation,
    getAgentAvailability,
  };
};

export default useAgentInformationByID;
