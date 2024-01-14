import * as Sentry from "@sentry/react";
import { useCallback, useEffect, useState } from "react";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

const LEADS_API_VERSION = "v2.0";

function generateURL(baseURL, leadIDs) {
    const leadParams = leadIDs.map((leadID) => `leadIds=${leadID}`).join("&");
    const url = `${baseURL}${leadParams ? `?${leadParams}` : ""}`;
    return url;
}

function usePolicyCount(allLeads) {
    const [isLoading, setIsLoading] = useState(false);
    const [policyCounts, setPolicyCounts] = useState([]);
    const showToast = useToast();
    const { npn } = useUserProfile();

    const URL = `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/PolicyCount/${npn}`;
    const updateURL = generateURL(URL, allLeads);

    const { Get: getPolicyCount } = useFetch(updateURL);

    const fetchPolicyCounts = useCallback(async () => {
        if (npn) {
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
    }, [npn, showToast, getPolicyCount]);

    useEffect(() => {
        fetchPolicyCounts();
    }, [fetchPolicyCounts]);

    return { policyCounts, isLoading };
}

export default usePolicyCount;
