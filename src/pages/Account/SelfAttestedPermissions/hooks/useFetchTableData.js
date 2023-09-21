import { useState, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/react";

import agentsSelfService from "services/agentsSelfService";
import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";

function useFetchTableData() {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const addToast = useToast();
  const { agentId } = useUserProfile();

  const fetchTableData = useCallback(async () => {
    if (!agentId) return;
    try {
      setIsLoading(true);
      const response = await agentsSelfService.getAgentSelfAttestations(
        agentId
      );
      setTableData(response);
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
  }, [agentId]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  return { tableData, isLoading, fetchTableData };
}

export default useFetchTableData;
