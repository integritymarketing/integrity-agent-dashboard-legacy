import PropTypes from "prop-types";

import useUserProfile from "hooks/useUserProfile";
import { useAgentAvailability } from "hooks/useAgentAvailability";

import clientsService from "services/clientsService";

import { useAgentAccountContext } from "providers/AgentAccountProvider";

import OpenBlue from "components/icons/version-2/OpenBlue";
import HealthLeadIcon from "components/icons/version-2/HealthLead";

import { SectionItem } from "../SectionItem";

function HealthLead({ setShowAvilabilityDialog }) {
    const { leadPreference, updateAgentPreferences, agentAvailability } = useAgentAccountContext();
    const { agentId, npn } = useUserProfile();
    const [isAvailable, setIsAvailable] = useAgentAvailability();

    const hasActiveLifeCallCampaign = agentAvailability?.activeCampaign?.hasActiveLifeCallCampaign;
    const hasActiveHealthCallCampaign = agentAvailability?.activeCampaign?.hasActiveHealthCallCampaign;

    const isPlanEnrollChecked = leadPreference?.medicareEnrollPurl;
    const isLifeChecked = hasActiveLifeCallCampaign ? leadPreference?.leadCenterLife : false;
    const shouldDisable = (!isPlanEnrollChecked && !isLifeChecked) || !hasActiveHealthCallCampaign;

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
    };

    return (
        <SectionItem
            title="Health"
            actionTitle={!hasActiveHealthCallCampaign ? "Set Up" : "Settings"}
            action={() => window.open(`/leadcenter-redirect/${npn}`, "_blank")}
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
