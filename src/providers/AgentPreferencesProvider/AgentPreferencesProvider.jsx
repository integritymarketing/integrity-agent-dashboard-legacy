import { useEffect, useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import useUserProfile from "hooks/useUserProfile";
import useAnalytics from "hooks/useAnalytics";
import useFetch from "hooks/useFetch";
import useRoles from "hooks/useRoles";
import useAgentPreferencesData from "hooks/useAgentPreferencesData";

const AgentPreferencesContext = createContext();

export const useAgentPreferences = () => useContext(AgentPreferencesContext);

export const AgentPreferencesProvider = ({ children }) => {
    const { agentId, npn } = useUserProfile();
    const { fireEvent } = useAnalytics();
    const { leadPreference, agentAvailability } = useAgentPreferencesData();
    const { isNonRTS_User } = useRoles();
    const { Get: fetchAgentNonRTSStatus } = useFetch(
        `${import.meta.env.VITE_AGENTS_URL}/api/v1.0/AgentsSelfService/isLifeNonRTS/${npn}`
    );
    const [defaults, setDefaults] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            if (!agentId || !npn) {
                return;
            }
            const agentNonRTSStatus = await fetchAgentNonRTSStatus();
            setDefaults({
                agent_id: agentId,
                agentNpn: npn,
                agent_has_life_rts: agentNonRTSStatus === "True" ? "No" : "Yes",
                agent_has_health_rts: isNonRTS_User ? "No" : "Yes",
                life_selling_enabled: leadPreference?.hideLifeQuote ? "No" : "Yes",
                health_selling_enabled: leadPreference?.hideHealthQuote ? "No" : "Yes",
                life_leads_enabled: leadPreference?.hasActiveLifeCallCampaign ? "Yes" : "No",
                health_leads_enabled: leadPreference?.hasActiveHealthCallCampaign ? "Yes" : "No",
                plan_enroll_leads_enabled: leadPreference?.medicareEnrollPurl ? "Yes" : "No",
                availability_switch_enabled: agentAvailability?.isAvailable ? "Yes" : "No",
            });
        };

        fetchData();
    }, [agentId, npn, fetchAgentNonRTSStatus, isNonRTS_User, leadPreference,agentAvailability]);

    // Define the tracking function within the provider
    const trackAgentPreferencesEvents = (overrides = {}) => {
        // Combine defaults with overrides, where overrides take precedence
        const eventData = { ...defaults, ...overrides };

        if (!eventData.agent_id) {return;}

        // Logic to trigger the event using fireEvent and the provided data
        fireEvent("User Properties", eventData);
    };

    return (
        <AgentPreferencesContext.Provider value={{ ...defaults, trackAgentPreferencesEvents, agentAvailability }}>
            {children}
        </AgentPreferencesContext.Provider>
    );
};

AgentPreferencesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
