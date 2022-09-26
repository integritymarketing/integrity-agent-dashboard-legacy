import { useEffect, useState, useContext } from "react";
import AuthContext from "contexts/auth";
import { getSignalRConnection } from "hooks/signalRConnection";

export const useAgentAvailability = (initial = false) => {
  const auth = useContext(AuthContext);
  const [isAvailable, setIsAvailable] = useState(initial);

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
