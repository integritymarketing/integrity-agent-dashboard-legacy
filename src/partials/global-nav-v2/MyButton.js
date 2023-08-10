import React, { useState } from "react";
import ToggleOffline from "./ToggleOffline.svg";
import ToggleOnline from "./ToggleOnline.svg";
import "./myButton.scss";
import AvailabilityOverlay from "./microComponent/AvailabilityOverlay";
import { useEffect } from "react";
import Notice from "./microComponent/Notice";
import { useClientServiceContext } from "services/clientServiceProvider";
import useUserProfile from "hooks/useUserProfile";

function MyButton({
  clickButton,
  isAvailable,
  page,
  leadPreference,
  hasActiveCampaign,
}) {
  const { clientsService } = useClientServiceContext();
  const userProfile = useUserProfile();
  const { agentId } = userProfile;
  const [isCheckInUpdateModalDismissed, setIsCheckInUpdateModalDismissed] =
    useState(true);
  const [isAvailabiltyModalVisible, setIsAvailabiltyModalVisible] =
    useState(false);
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);
  const statusText = isAvailable ? "online" : "offline";

  async function handleClick() {
    const response = await clientsService.getAgentAvailability(agentId);

    if (
      (hasActiveCampaign && leadPreference?.leadCenter) ||
      leadPreference?.medicareEnroll
    ) {
      typeof clickButton == "function" && clickButton();
      if (!isCheckInUpdateModalDismissed) {
        setIsAvailabiltyModalVisible(true);
      }
    }
    // When Availabily is set to false and leadSource:leadCenter is false with active campaign then we restrict user from toggling and instead we shaow a notice
    else if (
      response?.hasActiveCampaign &&
      !response?.leadPreference.leadCenter &&
      !response?.leadPreference.medicareEnrollPurl
    ) {
      handleDisable();
    }
    // When Availabily is set to false and leadSource:leadCenter is true with no active campaign then we restrict user from toggling and instead we shaow a notice
    else if (
      !response?.hasActiveCampaign &&
      response?.leadPreference.leadCenter &&
      !response?.leadPreference.medicareEnrollPurl
    ) {
      handleDisable();
    }
    // When Availabily is set to false and flags are also false then we restrict user from toggling and instead we shaow a notice
    else if (
      !response?.leadPreference.leadCenter &&
      !response?.leadPreference.medicareEnrollPurl
    ) {
      handleDisable();
    } else {
      clickButton();
      if (!isCheckInUpdateModalDismissed) {
        setIsAvailabiltyModalVisible(true);
      }
    }
  }
  const handleDisable = () => {
    setIsNoticeVisible(true);
  };
  const onDismissed = () => {
    setIsCheckInUpdateModalDismissed(true);
    setIsAvailabiltyModalVisible(false);
    let data = {
      agentID: agentid,
      leadPreference: {
        ...leadPreference,
        isCheckInUpdateModalDismissed: true,
      },
    };
    clientsService.updateAgentPreferences(data);
  };

  useEffect(() => {
    setIsCheckInUpdateModalDismissed(
      leadPreference.isCheckInUpdateModalDismissed || true
    );
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
              className={`buttonIcon offButton ${
                !isAvailable ? "show" : "hidden"
              }`}
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
            setIsAvailabiltyModalVisible(false);
          }}
          onDismissed={onDismissed}
        />
      )}
      {isNoticeVisible && (
        <Notice hideModal={() => setIsNoticeVisible(false)} />
      )}
    </>
  );
}
export default MyButton;
