import * as Sentry from "@sentry/react";
import { useCallback, useEffect, useState } from "react";

import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";

import clientsService from "services/clientsService";

function useAgentPreferencesData() {
    const [isLoading, setIsLoading] = useState(false);
    const [leadPreference, setLeadPreference] = useState({});
    const { agentId } = useUserProfile();
    const showToast = useToast();

    const getAgentAccountData = useCallback(async () => {
        if (!agentId) {
            return;
        }
        try {
            setIsLoading(true);
            const response = await clientsService.getAgentAvailability(agentId);
            setLeadPreference(response?.leadPreference);
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
    }, [showToast, agentId]);

    const updateAgentPreferences = useCallback(
        async (payload) => {
            try {
                const response = await clientsService.updateAgentPreferences(payload);
                setLeadPreference(response?.leadPreference);
            } catch (error) {
                showToast({
                    type: "error",
                    message: "Failed to Save the Preferences.",
                    time: 10000,
                });
                Sentry.captureException(error);
            }
        },
        [showToast]
    );

    useEffect(() => {
        getAgentAccountData();
    }, [getAgentAccountData]);

    return { leadPreference, isLoading, updateAgentPreferences };
}

export default useAgentPreferencesData;
