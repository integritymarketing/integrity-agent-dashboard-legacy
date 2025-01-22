import * as Sentry from "@sentry/react";
import { useCallback, useEffect, useState } from "react";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

const AGENTS_API_VERSION = "v1.0";

function useFetchTableData() {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const showToast = useToast();
    const { npn } = useUserProfile();

    const URL = `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/fexAttestation/${npn}`;

    const { Get: getAgentSelfAttestations } = useFetch(URL);

    const fetchTableData = useCallback(
        async (silent = false) => {
            if (!npn) {
                return;
            }
            try {
                if (!silent) {
                    setIsLoading(true);
                }
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
        },
        [npn, showToast, getAgentSelfAttestations]
    );

    useEffect(() => {
        fetchTableData();
    }, [fetchTableData]);

    return { tableData, isLoading, fetchTableData };
}

export default useFetchTableData;
