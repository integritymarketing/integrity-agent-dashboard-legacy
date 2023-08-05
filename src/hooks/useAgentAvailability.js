import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getSignalRConnection } from "hooks/signalRConnection";
import { isAgentAvailableAtom } from "../recoil/agent/atoms";
import { useRecoilState } from "recoil";
import useUserProfile from "./useUserProfile";

export const useAgentAvailability = () => {
  const { isAuthenticated } = useAuth0();
  const [isAgentAvailable, setIsAgentAvailable] =
    useRecoilState(isAgentAvailableAtom);
  const { agentId } = useUserProfile();

  useEffect(() => {
    if (isAuthenticated) {
      const connection = getSignalRConnection(agentId);
      connection.on("AgentAvailability", (availabilityStatus) => {
        setIsAgentAvailable(availabilityStatus);
      });
    }
  }, [isAuthenticated, agentId, setIsAgentAvailable]);

  return [isAgentAvailable, setIsAgentAvailable];
};
