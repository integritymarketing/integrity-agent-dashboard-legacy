import PropTypes from "prop-types";

import useUserProfile from "hooks/useUserProfile";
import { useAgentAvailability } from "hooks/useAgentAvailability";
import { useClientServiceContext } from "services/clientServiceProvider";
import { useAgentPreferences } from "providers/AgentPreferencesProvider/AgentPreferencesProvider";

import PlanEnrollIcon from "components/icons/version-2/PlanEnroll";

import { useAgentAccountContext } from "providers/AgentAccountProvider";

import { SectionItem } from "../SectionItem";

function PlanEnroll({ setShowAvilabilityDialog }) {
    const { leadPreference, updateAgentPreferences, agentAvailability } = useAgentAccountContext();
    const { agentId } = useUserProfile();
    const [isAvailable, setIsAvailable] = useAgentAvailability();
    const { trackAgentPreferencesEvents } = useAgentPreferences();
    const { clientsService } = useClientServiceContext();

    const hasActiveLifeCallCampaign = agentAvailability?.activeCampaign?.hasActiveLifeCallCampaign;
    const hasActiveHealthCallCampaign = agentAvailability?.activeCampaign?.hasActiveHealthCallCampaign;

    const isPlanEnrollChecked = leadPreference?.medicareEnrollPurl;
    const isLifeCheck = hasActiveLifeCallCampaign ? leadPreference?.leadCenterLife : false;
    const isHealthChecked = hasActiveHealthCallCampaign ? leadPreference?.leadCenter : false;
    const shouldDisable = !isLifeCheck && !isHealthChecked && isPlanEnrollChecked;

    const handleMedicareEnroll = async () => {
        setShowAvilabilityDialog(false);
        const data = {
            agentID: agentId,
            leadPreference: {
                ...leadPreference,
                medicareEnrollPurl: !leadPreference?.medicareEnrollPurl,
            },
        };
        await updateAgentPreferences(data);
        trackAgentPreferencesEvents({ plan_enroll_leads_enabled: data?.medicareEnrollPurl ? "Yes" : "No" });

        if (isAvailable && leadPreference?.medicareEnrollPurl && !isHealthChecked && !isLifeCheck) {
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
            title="PlanEnroll"
            onChange={handleMedicareEnroll}
            checked={leadPreference?.medicareEnrollPurl}
            icon={<PlanEnrollIcon />}
            disabled={shouldDisable}
            subTitle={`Show on PlanEnroll Agent website when "I'm Available."`}
        />
    );
}

PlanEnroll.propTypes = {
    setShowAvilabilityDialog: PropTypes.func,
};

export default PlanEnroll;
