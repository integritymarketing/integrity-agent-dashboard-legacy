import { useEffect, useContext } from "react";
import AuthContext from "contexts/auth";
import { getSignalRConnection } from "hooks/signalRConnection";
import { isAgentAvailableAtom } from "../recoil/agent/atoms";
import { useRecoilState } from "recoil";

export const useAgentAvailability = () => {
  const auth = useContext(AuthContext);
  const [isAvailable, setIsAvailable] = useRecoilState(isAgentAvailableAtom);

  useEffect(() => {
    if (auth.isAuthenticated()) {
      const connection = getSignalRConnection(auth.userProfile?.agentid);
      connection.on("AgentAvailabilty", (message) => {
        setIsAvailable(message);
      });
    }
  }, [auth, setIsAvailable]);

  return [isAvailable, setIsAvailable];
};
