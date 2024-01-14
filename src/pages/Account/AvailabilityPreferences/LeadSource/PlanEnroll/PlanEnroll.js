import PropTypes from "prop-types";

import useUserProfile from "hooks/useUserProfile";
import { useAgentAvailability } from "hooks/useAgentAvailability";
import clientsService from "services/clientsService";

import PlanEnrollIcon from "components/icons/version-2/PlanEnroll";

import { useAgentAccountContext } from "providers/AgentAccountProvider";

import { SectionItem } from "../SectionItem";

function PlanEnroll({ setShowAvilabilityDialog }) {
    const { leadPreference, updateAgentPreferences, agentAvailability } = useAgentAccountContext();
    const { agentId } = useUserProfile();
    const [isAvailable, setIsAvailable] = useAgentAvailability();

    const hasActiveCampaign = agentAvailability?.hasActiveCampaign;

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
        if (
            isAvailable &&
            leadPreference?.medicareEnrollPurl &&
            !(leadPreference?.leadCenter && hasActiveCampaign && leadPreference?.leadCenterLife)
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
            title="PlanEnroll"
            onChange={handleMedicareEnroll}
            checked={leadPreference?.medicareEnrollPurl}
            icon={<PlanEnrollIcon />}
            subTitle={`Show on PlanEnroll Agent website when "I'm Available."`}
        />
    );
}

PlanEnroll.propTypes = {
    setShowAvilabilityDialog: PropTypes.func,
};

export default PlanEnroll;
