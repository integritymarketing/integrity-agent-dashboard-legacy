import { useState, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/react";

import clientsService from "services/clientsService";
import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import { mockData } from "../SAAddPermissionForm/mockData";

function useFetchAgentsData() {
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const addToast = useToast();
  const { npn } = useUserProfile;

  const fetchAgentsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await clientsService.getAgents(npn);
      setAgents(mockData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Sentry.captureException(error);
      addToast({
        type: "error",
        message: "Failed to load data",
        time: 10000,
      });
    }
  }, [npn]);

  useEffect(() => {
    fetchAgentsData();
  }, [fetchAgentsData]);

  return { agents, fetchAgentsData, isLoading };
}

export default useFetchAgentsData;
