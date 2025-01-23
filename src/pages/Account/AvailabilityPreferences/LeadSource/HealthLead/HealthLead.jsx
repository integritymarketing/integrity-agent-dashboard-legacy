import PropTypes from "prop-types";

import useUserProfile from "hooks/useUserProfile";
import { useAgentAvailability } from "hooks/useAgentAvailability";

import { useClientServiceContext } from "services/clientServiceProvider";
import { useAgentPreferences } from "providers/AgentPreferencesProvider/AgentPreferencesProvider";

import { useAgentAccountContext } from "providers/AgentAccountProvider";

import OpenBlue from "components/icons/version-2/OpenBlue";
import HealthLeadIcon from "components/icons/version-2/HealthLead";

import { SectionItem } from "../SectionItem";

function HealthLead({ setShowAvilabilityDialog }) {
    const { leadPreference, updateAgentPreferences, agentAvailability } = useAgentAccountContext();
    const { agentId, npn } = useUserProfile();
    const [isAvailable, setIsAvailable] = useAgentAvailability();
    const { trackAgentPreferencesEvents } = useAgentPreferences();
    const { clientsService } = useClientServiceContext();

    const hasActiveLifeCallCampaign = agentAvailability?.activeCampaign?.hasActiveLifeCallCampaign;
    const hasActiveHealthCallCampaign = agentAvailability?.activeCampaign?.hasActiveHealthCallCampaign;

    const isHealthChecked = leadPreference?.leadCenter;
    const isPlanEnrollChecked = leadPreference?.medicareEnrollPurl;
    const isLifeChecked = hasActiveLifeCallCampaign ? leadPreference?.leadCenterLife : false;
    const shouldDisable = (!isPlanEnrollChecked && !isLifeChecked && isHealthChecked) || !hasActiveHealthCallCampaign;

    const handleLeadCenter = async () => {
        const data = {
            agentID: agentId,
            leadPreference: {
                ...leadPreference,
                leadCenter: !leadPreference?.leadCenter,
            },
        };
        await updateAgentPreferences(data);
        if (isAvailable && leadPreference?.leadCenter && !isLifeChecked && !isPlanEnrollChecked) {
            await clientsService.updateAgentAvailability({
                agentID: agentId,
                availability: false,
            });
            setIsAvailable(false);
            setShowAvilabilityDialog(true);
        }
        await trackAgentPreferencesEvents();
    };
    return (
        <SectionItem
            title="Health"
            actionTitle={!hasActiveHealthCallCampaign ? "Set Up" : "Configure"}
            action={() => window.open(`${import.meta.env.VITE_AUTH0_LEADS_REDIRECT_URI}/LeadCenterSSO`, "_blank")}
            onChange={handleLeadCenter}
            disabled={shouldDisable}
            checked={hasActiveHealthCallCampaign ? leadPreference?.leadCenter : false}
            icon={<HealthLeadIcon />}
            actionIcon={<OpenBlue />}
            subTitle={`Include LeadCENTER Health Leads when "I'm Available."`}
        />
    );
}

HealthLead.propTypes = {
    setShowAvilabilityDialog: PropTypes.func,
};

export default HealthLead;
