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
    //  If the button is set to active we directly disable it without any further checkup
    if (isAvailable) {
      clickButton();
      if (!isCheckInUpdateModalDismissed) {
        setIsAvailabiltyModalVisible(true);
      }
    }
    // If hasActiveCampaign is true, show a pop-up
    else if (hasActiveCampaign) {
      setIsNoticeVisible(true);
    } else {
      // When Availability is set to off, we first need to check if one of the flag is true
      if (
        leadPreference.leadCenter === true ||
        leadPreference.medicareEnrollPurl === true
      ) {
        clickButton();
        if (!isCheckInUpdateModalDismissed) {
          setIsAvailabiltyModalVisible(true);
        }
      } else {
        // When Availabily is set to false and flags are also flase then we restrict user from toggling and instead we shaow a notice
        handleDisable();
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
