import * as Sentry from "@sentry/react";
import { useCallback } from "react";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import { useSALifeProductContext } from "../providers/SALifeProductProvider";

const AGENTS_API_VERSION = "v1.0";

function useDataHandler() {
    const { fetchTableData, setError, fetchCarriesData } = useSALifeProductContext();
    const showToast = useToast();
    const { npn } = useUserProfile();

    const URL = `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/fexAttestation/${npn}`;

    const { Put: updateSALifeRecord, Post: addSALifeRecord } = useFetch(URL);

    const updateRecord = useCallback(
        async (payload) => {
            const res = await updateSALifeRecord(payload, true);
            if (res.ok) {
                await fetchTableData();
                await fetchCarriesData();
            } else {
                setError(true);
                Sentry.captureException(res.statusText);
                showToast({
                    type: "error",
                    message: "Failed to update record",
                    time: 10000,
                });
            }
        },
        [fetchTableData, showToast, updateSALifeRecord, setError, fetchCarriesData]
    );

    const addRecord = useCallback(
        async (payload) => {
            const res = await addSALifeRecord(payload, true);
            if (res.ok) {
                await fetchTableData();
                await fetchCarriesData();
            } else {
                setError(true);
                Sentry.captureException(res.statusText);
                showToast({
                    type: "error",
                    message: "Failed to add record",
                    time: 10000,
                });
            }
        },
        [fetchTableData, showToast, addSALifeRecord, setError, fetchCarriesData]
    );

    return { updateRecord, addRecord };
}

export default useDataHandler;
