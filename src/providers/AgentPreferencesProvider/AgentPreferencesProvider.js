import { useEffect, useState, createContext, useContext } from "react";
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
        `${process.env.REACT_APP_AGENTS_URL}/api/v1.0/AgentsSelfService/isLifeNonRTS/${npn}`
    );

    // State to hold the default data
    const [defaults, setDefaults] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const agentNonRTSStatus = await fetchAgentNonRTSStatus();
            setDefaults({
                agent_id: agentId,
                agentNpn: npn,
                agent_has_life_rts: agentNonRTSStatus === "True" ? "N" : "Y",
                agent_has_health_rts: isNonRTS_User ? "N" : "Y",
                life_selling_enabled: leadPreference.hideLifeQuote ? "N" : "Y",
                health_selling_enabled: leadPreference.hideHealthQuote ? "N" : "Y",
                life_leads_enabled: leadPreference.hasActiveLifeCallCampaign ? "Y" : "N",
                plan_enroll_leads_enabled: leadPreference.medicareEnrollPurl ? "Y" : "N",
                availability_switch_enabled: agentAvailability.isAvailable ? "Y" : "N",
            });
        };

        fetchData();
    }, [agentId, npn, fetchAgentNonRTSStatus]);

    // Define the tracking function within the provider
    const trackAgentPreferencesEvents = async (overrides = {}) => {
        // Combine defaults with overrides, where overrides take precedence
        const eventData = { ...defaults, ...overrides };

        if (!eventData.agentId) return;

        // Logic to trigger the event using fireEvent and the provided data
        fireEvent("User Properties", eventData);
    };

    return (
        <AgentPreferencesContext.Provider value={{ ...defaults, trackAgentPreferencesEvents }}>
            {children}
        </AgentPreferencesContext.Provider>
    );
};
