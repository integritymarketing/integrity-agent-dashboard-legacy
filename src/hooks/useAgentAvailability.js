import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getSignalRConnection } from "hooks/signalRConnection";
import { isAgentAvailableAtom } from "../recoil/agent/atoms";
import { useRecoilState } from "recoil";
import useUserProfile from "hooks/useUserProfile";

export const useAgentAvailability = () => {
    const { isAuthenticated } = useAuth0();
    const { agentId } = useUserProfile();
    const [isAvailable, setIsAvailable] = useRecoilState(isAgentAvailableAtom);

    useEffect(() => {
        if (isAuthenticated) {
            const connection = getSignalRConnection(agentId);
            connection.on("AgentAvailabilty", (message) => {
                setIsAvailable(message);
            });
        }
    }, [isAuthenticated, setIsAvailable, agentId]);

    return [isAvailable, setIsAvailable];
};
