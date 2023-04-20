import React, { useState } from "react";
import ToggleOffline from "./ToggleOffline.svg";
import ToggleOnline from "./ToggleOnline.svg";
import "./myButton.scss";
import AvailabilityOverlay from "./microComponent/AvailabilityOverlay";
import { useEffect } from "react";
import Notice from "./microComponent/Notice";
import clientService from "services/clientsService";
import AuthContext from "contexts/auth";
import { useContext } from "react";

function MyButton({
  clickButton,
  isAvailable,
  page,
  leadPreference,
  hasActiveCampaign,
}) {
  const auth = useContext(AuthContext);
  const [user, setUser] = useState();

  const [isCheckInUpdateModalDismissed, setIsCheckInUpdateModalDismissed] =
    useState(true);
  const [isAvailabiltyModalVisible, setIsAvailabiltyModalVisible] =
    useState(false);
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);
  const statusText = isAvailable ? "online" : "offline";

  async function handleClick() {
    const response = await clientService.getAgentAvailability(
      user?.profile.agentid
    );
    const { leadPreference, hasActiveCampaign, medicareEnrollPurl } =
      response || {};

    if (
      (hasActiveCampaign === true &&
        leadPreference === false &&
        medicareEnrollPurl === false) ||
      (hasActiveCampaign === false && medicareEnrollPurl === false) ||
      isAvailable ||
      (hasActiveCampaign === true && leadPreference?.leadCenter) ||
      leadPreference?.medicareEnroll
    ) {
      typeof clickButton == "function" && clickButton();
      if (!isCheckInUpdateModalDismissed) {
        setIsAvailabiltyModalVisible(true);
      }
    } else {
      handleDisable();
    }
  }
  const handleDisable = () => {
    setIsNoticeVisible(true);
  };
  const onDismissed = () => {
    setIsCheckInUpdateModalDismissed(true);
    setIsAvailabiltyModalVisible(false);
    let data = {
      agentID: user?.profile.agentid,
      leadPreference: {
        ...leadPreference,
        isCheckInUpdateModalDismissed: true,
      },
    };
    clientService.updateAgentPreferences(data);
  };
  async function fetchUser() {
    setUser(await auth.getUser());
  }
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [auth]);
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
