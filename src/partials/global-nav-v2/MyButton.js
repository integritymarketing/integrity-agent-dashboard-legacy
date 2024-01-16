import { useState, useEffect } from "react";
import ToggleOffline from "./ToggleOffline.svg";
import ToggleOnline from "./ToggleOnline.svg";
import "./myButton.scss";
import AvailabilityOverlay from "./microComponent/AvailabilityOverlay";

import Notice from "./microComponent/Notice";
import clientsService from "services/clientsService";
import useUserProfile from "hooks/useUserProfile";

function MyButton({ clickButton, isAvailable, page, leadPreference }) {
    const userProfile = useUserProfile();
    const { agentId } = userProfile;
    const [isCheckInUpdateModalDismissed, setIsCheckInUpdateModalDismissed] = useState(true);
    const [isAvailabiltyModalVisible, setIsAvailabiltyModalVisible] = useState(false);
    const [isNoticeVisible, setIsNoticeVisible] = useState(false);
    const statusText = isAvailable ? "online" : "offline";

    async function handleClick() {
        const response = await clientsService.getAgentAvailability(agentId);

        const hasActiveLifeCallCampaign = response?.activeCampaign?.hasActiveLifeCallCampaign;
        const hasActiveHealthCallCampaign = response?.activeCampaign?.hasActiveHealthCallCampaign;

        const isLifeCheck = leadPreference?.leadCenterLife && hasActiveLifeCallCampaign;
        const isHealthChecked = hasActiveHealthCallCampaign ? leadPreference?.leadCenter : false;
        const isPlanEnrollChecked = leadPreference?.medicareEnrollPurl;

        if (isAvailable) {
            if (!isLifeCheck && !isHealthChecked && !isPlanEnrollChecked) {
                setIsNoticeVisible(true);
                return;
            }
        }

        clickButton();

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
                <span className="myButtonText">I'm Available</span>
                <div className="myButton" onClick={handleClick}>
                    {statusText === "offline" && (
                        <img
                            src={ToggleOffline}
                            alt="offButton"
                            className={`buttonIcon offButton ${!isAvailable ? "show" : "hidden"}`}
                        />
                    )}
                    <img
                        src={ToggleOnline}
                        alt="onButton"
                        className={`buttonIcon onButton ${isAvailable ? "show" : "hidden"}`}
                    />
                </div>
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
