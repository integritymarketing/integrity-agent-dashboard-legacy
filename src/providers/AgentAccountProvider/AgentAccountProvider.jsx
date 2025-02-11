import { createContext, useContext, useMemo } from "react";

import PropTypes from "prop-types";

import useAgentPreferencesData from "hooks/useAgentPreferencesData";

import Spinner from "components/ui/Spinner/index";

const AgentAccountContext = createContext(null);

export const AgentAccountProvider = ({ children }) => {
    const { isLoading, updateAgentPreferences, leadPreference, agentAvailability } = useAgentPreferencesData();

    const contextValue = useMemo(
        () => ({ updateAgentPreferences, leadPreference, agentAvailability }),
        [leadPreference, updateAgentPreferences, agentAvailability]
    );

    if (isLoading) {
        return <Spinner />;
    }

    return <AgentAccountContext.Provider value={contextValue}>{children}</AgentAccountContext.Provider>;
};

AgentAccountProvider.propTypes = {
    children: PropTypes.node,
};

// Custom hook to access AgentAccountContext
export const useAgentAccountContext = () => {
    const context = useContext(AgentAccountContext);

    if (context === undefined) {
        throw new Error("useAgentAccountContext must be used within AgentAccountProvider");
    }

    return context;
};
