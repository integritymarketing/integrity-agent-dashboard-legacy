import Box from "@mui/material/Box";

import SectionContainer from "mobile/Components/SectionContainer";
import { useAgentAccountContext } from "providers/AgentAccountProvider";
import { useAgentPreferences } from "providers/AgentPreferencesProvider/AgentPreferencesProvider";

import useUserProfile from "hooks/useUserProfile";

import { SellingPreferenceItem } from "./SellingPreferenceItem";

const LIFE = "hideLifeQuote";
const HEALTH = "hideHealthQuote";

function SellingPreferences() {
    const { leadPreference, updateAgentPreferences } = useAgentAccountContext();
    const { agentId } = useUserProfile();
    const { trackAgentPreferencesEvents } = useAgentPreferences();

    const hideHealthQuoteOn = leadPreference?.hideHealthQuote;
    const hideLifeQuoteOn = leadPreference?.hideLifeQuote;

    const handleChange = (type) => (event) => {
        const value = !event.target.checked;
        const payload = {
            agentID: agentId,
            leadPreference: {
                ...leadPreference,
                [type]: value,
            },
        };

        updateAgentPreferences(payload);
        if (type === LIFE) {
            trackAgentPreferencesEvents({ life_selling_enabled: value ? "No" : "Yes" });
        }
        if (type === HEALTH) {
            trackAgentPreferencesEvents({ health_selling_enabled: value ? "No" : "Yes" });
        }
    };

    return (
        <Box>
            <SectionContainer title="Selling Preferences">
                <SellingPreferenceItem
                    title="Quote Life Products"
                    description="Enable quoting Final Expense products in Integrity and PlanEnroll Agent Website."
                    checked={!hideLifeQuoteOn}
                    onChange={handleChange(LIFE)}
                    disabled={hideHealthQuoteOn}
                />
                <SellingPreferenceItem
                    title="Quote Health Products"
                    description="Enable quoting Medicare products in Integrity and PlanEnroll Agent Website."
                    checked={!hideHealthQuoteOn}
                    onChange={handleChange(HEALTH)}
                    disabled={hideLifeQuoteOn}
                />
            </SectionContainer>
        </Box>
    );
}

export default SellingPreferences;
