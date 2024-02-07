import { useState, useEffect } from "react";
import ToggleOffline from "./ToggleOffline.svg";
import ToggleOnline from "./ToggleOnline.svg";
import "./myButton.scss";
import AvailabilityOverlay from "./microComponent/AvailabilityOverlay";
import { Switch } from "components/ui/version-2/Swich";

import Notice from "./microComponent/Notice";
import clientsService from "services/clientsService";
import useUserProfile from "hooks/useUserProfile";
import { useAgentAvailability } from "hooks/useAgentAvailability";

function MyButton({ page, leadPreference }) {
    const userProfile = useUserProfile();
    const { agentId } = userProfile;
    const [isAvailable, setIsAvailable] = useAgentAvailability();
    const [isCheckInUpdateModalDismissed, setIsCheckInUpdateModalDismissed] = useState(true);
    const [isAvailabiltyModalVisible, setIsAvailabiltyModalVisible] = useState(false);
    const [isNoticeVisible, setIsNoticeVisible] = useState(false);

    async function handleClick() {
        const response = await clientsService.getAgentAvailability(agentId);

        const hasActiveLifeCallCampaign = response?.activeCampaign?.hasActiveLifeCallCampaign;
        const hasActiveHealthCallCampaign = response?.activeCampaign?.hasActiveHealthCallCampaign;

        const isLifeCheck = response.leadPreference?.leadCenterLife && hasActiveLifeCallCampaign;
        const isHealthChecked = hasActiveHealthCallCampaign ? response.leadPreference?.leadCenter : false;
        const isPlanEnrollChecked = response.leadPreference?.medicareEnrollPurl;

        if (!isAvailable) {
            if (!isLifeCheck && !isHealthChecked && !isPlanEnrollChecked) {
                setIsNoticeVisible(true);
                return;
            }
        }

        await clientsService.updateAgentAvailability({
            agentID: agentId,
            availability: !isAvailable,
        });
        setIsAvailable(!isAvailable);

        if (!isCheckInUpdateModalDismissed && isAvailable) {
            setIsAvailabiltyModalVisible(true);
        }
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
                <span className="myButtonText">I'm Available:</span>
                <Switch checked={isAvailable} onChange={handleClick} />
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
            {isNoticeVisible && <Notice hideModal={() => setIsNoticeVisible(false)} />}
        </>
    );
}
export default MyButton;
