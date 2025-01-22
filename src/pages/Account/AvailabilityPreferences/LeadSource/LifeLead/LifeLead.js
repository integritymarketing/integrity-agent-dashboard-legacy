import PropTypes from "prop-types";

import { useAgentAccountContext } from "providers/AgentAccountProvider";

import useUserProfile from "hooks/useUserProfile";
import { useAgentAvailability } from "hooks/useAgentAvailability";

import LifeLeadSource from "components/icons/version-2/LifeLeadSource";
import OpenBlue from "components/icons/version-2/OpenBlue";

import { useClientServiceContext } from "services/clientServiceProvider";
import { SectionItem } from "../SectionItem";

function LifeLead({ setShowAvilabilityDialog }) {
    const { leadPreference, updateAgentPreferences, agentAvailability } = useAgentAccountContext();
    const { agentId, npn } = useUserProfile();
    const [isAvailable, setIsAvailable] = useAgentAvailability();
    const { clientsService } = useClientServiceContext();

    const hasActiveLifeCallCampaign = agentAvailability?.activeCampaign?.hasActiveLifeCallCampaign;
    const hasActiveHealthCallCampaign = agentAvailability?.activeCampaign?.hasActiveHealthCallCampaign;

    const isLifeCheck = leadPreference?.leadCenterLife;
    const isPlanEnrollChecked = leadPreference?.medicareEnrollPurl;
    const isHealthChecked = hasActiveHealthCallCampaign ? leadPreference?.leadCenter : false;
    const shouldDisable = (!isPlanEnrollChecked && !isHealthChecked && isLifeCheck) || !hasActiveLifeCallCampaign;

    const handleLifeLeadToggle = async () => {
        const data = {
            agentID: agentId,
            leadPreference: {
                ...leadPreference,
                leadCenterLife: !leadPreference?.leadCenterLife,
            },
        };
        await updateAgentPreferences(data);
        if (isAvailable && leadPreference?.leadCenterLife && !isPlanEnrollChecked && !isHealthChecked) {
            await clientsService.updateAgentAvailability({
                agentID: agentId,
                availability: false,
            });
            setIsAvailable(false);
            setShowAvilabilityDialog(true);
        }
    };

    return (
        <SectionItem
            title="Life"
            actionTitle={hasActiveLifeCallCampaign ? "Configure" : "Set Up"}
            action={() => window.open(`${import.meta.env.VITE_AUTH0_LEADS_REDIRECT_URI}/LeadCenterSSO`, "_blank")}
            onChange={handleLifeLeadToggle}
            disabled={shouldDisable}
            checked={hasActiveLifeCallCampaign ? leadPreference?.leadCenterLife : false}
            icon={<LifeLeadSource />}
            actionIcon={<OpenBlue />}
            subTitle={`Include LeadCENTER Life Leads when "I'm Available."`}
        />
    );
}

LifeLead.propTypes = {
    setShowAvilabilityDialog: PropTypes.func,
};

export default LifeLead;
