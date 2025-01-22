import { useState, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/react";

import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import useFetch from "hooks/useFetch";

const AGENTS_API_VERSION = "v1.0";

function useFetchAgentsData() {
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const showToast = useToast();
  const { npn } = useUserProfile();

  const URL = `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/Agents/rts/${npn}`;

  const { Get: getAgents } = useFetch(URL);

  const fetchAgentsData = useCallback(async () => {
    if (!npn) return;
    try {
      setIsLoading(true);
      const response = await getAgents();
      const filteredAgents = response.filter((agent) => agent.isSelfAttested === "FALSE")
      setAgents(filteredAgents);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Sentry.captureException(error);
      showToast({
        type: "error",
        message: "Failed to load data",
        time: 10000,
      });
    }
  }, [npn, showToast, getAgents]);

  useEffect(() => {
    fetchAgentsData();
  }, [fetchAgentsData]);

  return { agents, isLoading };
}

export default useFetchAgentsData;
