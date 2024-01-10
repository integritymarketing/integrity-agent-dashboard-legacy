import * as Sentry from "@sentry/react";
import { useCallback, useEffect, useState } from "react";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

const LEADS_API_VERSION = "v2.0";

function usePolicyCount() {
    const [isLoading, setIsLoading] = useState(false);
    const [policyCounts, setPolicyCounts] = useState([]);
    const showToast = useToast();
    const { npn } = useUserProfile();

    const URL = `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/PolicyCount/${npn}`;

    const { Get: getPolicyCount } = useFetch(URL);

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
