import Box from "@mui/material/Box";

import SectionContainer from "mobile/Components/SectionContainer";
import { useAgentAccountContext } from "providers/AgentAccountProvider";

import useUserProfile from "hooks/useUserProfile";

import { SellingPreferenceItem } from "./SellingPreferenceItem";

const LIFE = "hideLifeQuote";
const HEALTH = "hideHealthQuote";

function SellingPreferences() {
    const { leadPreference, updateAgentPreferences } = useAgentAccountContext();
    const { agentId } = useUserProfile();

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
    };

    return (
        <Box mt={4}>
            <SectionContainer title="Selling Preferences">
                <SellingPreferenceItem
                    title="Quote Life Products"
                    description="Enable quoting Final Expense products in Client Manager and Personal Website."
                    checked={!hideLifeQuoteOn}
                    onChange={handleChange(LIFE)}
                    disabled={hideHealthQuoteOn}
                />
                <SellingPreferenceItem
                    title="Quote Health Products"
                    description="Enable quoting Medicare products in Client Manager and Personal Website."
                    checked={!hideHealthQuoteOn}
                    onChange={handleChange(HEALTH)}
                    disabled={hideLifeQuoteOn}
                />
            </SectionContainer>
        </Box>
    );
}

export default SellingPreferences;
