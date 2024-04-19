import * as Sentry from "@sentry/react";
import { useCallback, useEffect, useState } from "react";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

const LEADS_API_VERSION = "v2.0";

function generateURL(baseURL, leadIDs) {
    const leadParams = leadIDs.map((leadID) => `leadIds=${leadID}`).join("&");
    return `${baseURL}${leadParams ? `?${leadParams}` : ""}`;
}

function usePolicyCount(allLeads) {
    const [isLoading, setIsLoading] = useState(false);
    const [policyCounts, setPolicyCounts] = useState([]);
    const showToast = useToast();
    const { npn } = useUserProfile();
    const [updateURL, setUpdateURL] = useState("");

    useEffect(() => {
        if (npn && allLeads.length > 0) {
            const URL = `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/PolicyCount/${npn}`;
            setUpdateURL(generateURL(URL, allLeads));
        }
    }, [npn, allLeads]);

    const { Get: getPolicyCount } = useFetch(updateURL);

    const fetchPolicyCounts = useCallback(async () => {
        if (updateURL) {
            try {
                setIsLoading(true);
                const response = await getPolicyCount();
                setPolicyCounts(response);
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
        }
    }, [updateURL, getPolicyCount, showToast]);

    useEffect(() => {
        fetchPolicyCounts();
    }, [fetchPolicyCounts]);

    return { policyCounts, isLoading };
}

export default usePolicyCount;
