 
import { createContext, useCallback, useState, useMemo } from "react";

import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import useUserProfile from "hooks/useUserProfile";
import PropTypes from "prop-types";
import useFetch from "hooks/useFetch";

// Create a context for Agent Profile
export const ProfessionalProfileContext = createContext();

/**
 * Provider component to manage agent profile state and actions.
 * @param {object} props - React children nodes
 */
export const ProfessionalProfileProvider = ({ children }) => {
    // Retrieve the agentId from the user profile
    const { agentId, npn } = useUserProfile();

    // Hook for displaying toast notifications
    const showToast = useToast();

    // Axios hooks for API calls

    const AGENTS_URL = `${process.env.REACT_APP_AGENTS_URL}/api/v1.0/Agents/${agentId}`;
    const PROFESSIONAL_URL = `${process.env.REACT_APP_AGENTS_URL}/api/v1.0/AgentProfessionalInfo/${npn}`;

    const { Get: fetchAgentProfileData, loading: fetchAgentProfileDataLoading } = useFetch(AGENTS_URL);

    const { Get: fetchAgentProfessionalInfo, loading: fetchAgentProfessionalInfoLoading } = useFetch(PROFESSIONAL_URL);

    // State for storing agent preferences and availability
    const [profileInfo, setProfileInfo] = useState(null);

    const getAgentProfessionalInfo = useCallback(async () => {
        if (!npn) {return null;}
        try {
            const response = await fetchAgentProfessionalInfo();
            if (response) {
                return response;
            }
            return null;
        } catch (error) {
            Sentry.captureException(error);
            return null;
        }
    }, [npn, fetchAgentProfessionalInfo, showToast]);

    const getAgentProfileData = useCallback(async () => {
        if (!agentId) {return;}
        try {
            const response = await fetchAgentProfileData();

            if (response) {
                setProfileInfo(response || {});
            }
        } catch (error) {
            Sentry.captureException(error);
            showToast({
                type: "error",
                message: "Failed to load data",
                time: 10000,
            });
        }
    }, [fetchAgentProfileData, showToast, AGENTS_URL, agentId]);

    // Memoize context value to optimize re-renders
    const contextValue = useMemo(
        () => ({
            profileInfo,
            getAgentProfileData,
            fetchAgentProfileDataLoading,
            getAgentProfessionalInfo,
            fetchAgentProfessionalInfoLoading,
        }),
        [
            profileInfo,
            getAgentProfileData,
            fetchAgentProfileDataLoading,
            getAgentProfessionalInfo,
            fetchAgentProfessionalInfoLoading,
        ]
    );

    // Provide the context value to children
    return <ProfessionalProfileContext.Provider value={contextValue}>{children}</ProfessionalProfileContext.Provider>;
};

ProfessionalProfileProvider.propTypes = {
    /** React children nodes */
    children: PropTypes.node.isRequired,
};
