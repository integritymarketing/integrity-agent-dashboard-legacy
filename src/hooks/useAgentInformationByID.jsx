import { useEffect } from "react";
import { useClientServiceContext } from "services/clientServiceProvider";
import useUserProfile from "./useUserProfile";
import useFetch from "./useFetch";
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useSetRecoilState } from "recoil";
import { agentIdAtom, clientServiceAtom } from "@/recoil/agent/atoms";
import { agentInformationSelector } from "@/recoil/agent/selectors";

const useAgentInformationByID = () => {
    const { agentId } = useUserProfile();
    const { clientsService } = useClientServiceContext();
    const agentInformation = useRecoilValue(agentInformationSelector);
    const setClientService = useSetRecoilState(clientServiceAtom);
    const setAgentId = useSetRecoilState(agentIdAtom);
    const { Post: createAgentPurl } = useFetch(`${import.meta.env.VITE_AGENTS_URL}/api/v1.0/Purl`);
    const agentNPN = agentInformation?.agentNPN;
    const agentPurl = agentInformation?.agentPurl;

    const getAgentAvailability = useRecoilRefresher_UNSTABLE(agentInformationSelector);

    useEffect(() => {
        if (clientsService) {
            setClientService(clientsService);
        }
    }, [clientsService, setClientService]);

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
