import { useState, useEffect } from "react";
import "./myButton.scss";
import AvailabilityOverlay from "./microComponent/AvailabilityOverlay";
import { Switch } from "@mui/material";

import Notice from "./microComponent/Notice";
import { useClientServiceContext } from "services/clientServiceProvider";
import useUserProfile from "hooks/useUserProfile";
import { useAgentAvailability } from "hooks/useAgentAvailability";
import { useAgentPreferences } from "providers/AgentPreferencesProvider/AgentPreferencesProvider";

function MyButton({ page, leadPreference }) {
    const userProfile = useUserProfile();
    const { agentId } = userProfile;
    const [isAvailable, setIsAvailable] = useAgentAvailability();
    const [isCheckInUpdateModalDismissed, setIsCheckInUpdateModalDismissed] = useState(true);
    const [isAvailabiltyModalVisible, setIsAvailabiltyModalVisible] = useState(false);
    const [isNoticeVisible, setIsNoticeVisible] = useState(false);
    const { trackAgentPreferencesEvents } = useAgentPreferences();
    const { clientsService } = useClientServiceContext();

    async function handleClick() {
        const response = await clientsService.getAgentAvailability(agentId);

        const hasActiveLifeCallCampaign = response?.activeCampaign?.hasActiveLifeCallCampaign;
        const hasActiveHealthCallCampaign = response?.activeCampaign?.hasActiveHealthCallCampaign;

        const isLifeCheck = response.leadPreference?.leadCenterLife && hasActiveLifeCallCampaign;
        const isHealthChecked = hasActiveHealthCallCampaign ? response.leadPreference?.leadCenter : false;

        if (!isLifeCheck && !isHealthChecked) {
            setIsAvailable(false);
            setIsNoticeVisible(true);
            return;
        } else {
            try {
                await clientsService.updateAgentAvailability({
                    agentID: agentId,
                    availability: !isAvailable,
                });
                setIsAvailable(!isAvailable);
            } catch (error) {
                console.error("Error in updating agent availability", error);
            }
        }

        if (!isCheckInUpdateModalDismissed && isAvailable) {
            setIsAvailabiltyModalVisible(true);
        }

        trackAgentPreferencesEvents({ availability_switch_enabled: !isAvailable ? "Yes" : "No" });
    }

    const onDismissed = () => {
        setIsCheckInUpdateModalDismissed(true);
        setIsAvailabiltyModalVisible(false);
        const data = {
            agentID: agentId,
            leadPreference: {
                ...leadPreference,
                isCheckInUpdateModalDismissed: true,
            },
        };
        clientsService.updateAgentPreferences(data);
        document.body.style.overflow = "auto";
    };

    useEffect(() => {
        setIsCheckInUpdateModalDismissed(leadPreference.isCheckInUpdateModalDismissed || true);

        if (
            leadPreference.isCheckInUpdateModalDismissed !== undefined &&
            leadPreference.isCheckInUpdateModalDismissed === false &&
            leadPreference?.isAgentMobilePopUpDismissed &&
            page === "dashboard"
        ) {
            setIsAvailabiltyModalVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            setIsAvailabiltyModalVisible(false);
        }
    }, [leadPreference, isCheckInUpdateModalDismissed, page]);

    return (
        <>
            <div id="myButton" className="myButtonWrapper">
                <span className="myButtonText">I'm Available</span>
                <Switch
                    checked={!!isAvailable}
                    onChange={handleClick}
                    variant="availability"
                    inputProps={{ "aria-label": "controlled" }}
                />
            </div>
            {isAvailabiltyModalVisible && (
                <AvailabilityOverlay
                    hideModal={() => {
                        document.body.style.overflow = "auto";
                        setIsAvailabiltyModalVisible(false);
                    }}
                    onDismissed={onDismissed}
                />
            )}
            <Notice handleClose={() => setIsNoticeVisible(false)} open={isNoticeVisible} />
        </>
    );
}
export default MyButton;
