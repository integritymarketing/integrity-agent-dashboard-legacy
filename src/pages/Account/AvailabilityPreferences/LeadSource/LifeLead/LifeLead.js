import PropTypes from "prop-types";

import { useAgentAccountContext } from "providers/AgentAccountProvider";

import useUserProfile from "hooks/useUserProfile";
import { useAgentAvailability } from "hooks/useAgentAvailability";

import LifeLeadSource from "components/icons/version-2/LifeLeadSource";
import OpenBlue from "components/icons/version-2/OpenBlue";

import clientsService from "services/clientsService";

import { SectionItem } from "../SectionItem";

function LifeLead({ setShowAvilabilityDialog }) {
    const { leadPreference, updateAgentPreferences, agentAvailability } = useAgentAccountContext();
    const { agentId, npn } = useUserProfile();
    const [isAvailable, setIsAvailable] = useAgentAvailability();

    const hasActiveLifeCallCampaign = agentAvailability?.activeCampaign?.hasActiveLifeCallCampaign;

    const handleLifeLeadToggle = async () => {
        const data = {
            agentID: agentId,
            leadPreference: {
                ...leadPreference,
                leadCenterLife: !leadPreference?.leadCenterLife,
            },
        };
        await updateAgentPreferences(data);
        if (
            isAvailable &&
            leadPreference?.leadCenterLife &&
            !leadPreference?.leadCenter &&
            !leadPreference?.medicareEnrollPurl
        ) {
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
            action={() => window.open(`/leadcenter-redirect/${npn}`, "_blank")}
            onChange={handleLifeLeadToggle}
            disabled={!hasActiveLifeCallCampaign}
            checked={leadPreference?.leadCenterLife && hasActiveLifeCallCampaign}
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
