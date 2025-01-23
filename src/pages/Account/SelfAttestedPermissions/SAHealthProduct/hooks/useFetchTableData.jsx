import { useState, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/react";

import useUserProfile from "hooks/useUserProfile";
import useToast from "hooks/useToast";
import useFetch from "hooks/useFetch";

const AGENTS_API_VERSION = "v1.0";

function useFetchTableData() {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const showToast = useToast();
  const { agentId } = useUserProfile();

  const URL = `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/attestation/${agentId}`;

  const { Get: getAgentSelfAttestations } = useFetch(URL);

  const fetchTableData = useCallback(async () => {
    if (!agentId) return;
    try {
      setIsLoading(true);
      const response = await getAgentSelfAttestations();
      setTableData(response);
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
  }, [agentId, showToast, getAgentSelfAttestations]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  return { tableData, isLoading, fetchTableData };
}

export default useFetchTableData;
