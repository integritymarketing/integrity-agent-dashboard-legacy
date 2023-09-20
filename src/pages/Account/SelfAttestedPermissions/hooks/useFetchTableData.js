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
      setTableData([
        {
          attestationId: 0,
          agentId: 0,
          bu: "string",
          npn: "string",
          carrier: "Tets carrier",
          awn: "1233211",
          state: "TX",
          product: "MA",
          rtsStatus: "string",
          planYear: 2023,
          blobPath: "string",
          isSelfAttested: true,
          inActive: 0,
          createDate: "2023-06-20T23:15:56.737Z",
          lastUpdated: "2023-09-20T23:15:56.737Z",
        },
      ]);
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

  return { tableData, isLoading };
}

export default useFetchTableData;
