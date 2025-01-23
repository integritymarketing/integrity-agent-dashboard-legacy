import React, { useState, Fragment, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import RenderModalItem from "./renderModalItem";
import ModalText from "./ModalText";
import ModalContactText from "./ModalContactText";
import "./myModal.scss";
import LeadText from "./leadText";
import CheckOut from "./checkout";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";

const StyledIconButton = styled(CloseIcon)(({ theme }) => ({
  cursor: "pointer",
  display: "flex",
  width: "24px",
  height: "24px",
  color: "#0052CE",
  marginLeft: "auto",
}));

export default function BasicModal({
  handleClose: onClose,
  isAvailable,
  open,
  phone,
  virtualNumber,
  updateAgentAvailability,
  agentid,
  leadPreference,
  updateAgentPreferences,
  callForwardNumber,
  getAgentAvailability,
  checkInPreference = false,
  hideModalHeader = false,
}) {
  const [activeModal, setActiveModal] = useState("main");
  const showAsModal =
    !checkInPreference || activeModal !== "main" ? true : false;
  const [preferences, setPreferences] = useState({
    data: false,
    call: false,
    leadCenter: false,
    medicareEnrollPurl: false,
    isAgentMobilePopUpDismissed: false,
    medicareEnroll: false,
  });

  const handleClose = () => {
    if (checkInPreference) {
      setActiveModal("main");
    }
    onClose();
  };

  const handlePreferences = (name, value) => {
    setPreferences((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (open) setActiveModal("main");
  }, [open]);

  useEffect(() => {
    if (!leadPreference?.call && !leadPreference?.data) {
      setPreferences({ ...leadPreference, call: true });
    } else setPreferences(leadPreference);
  }, [leadPreference]);

  const handleClick = (value) => {
    setActiveModal(value);
  };
  const handleButtonClick = (key) => {
    if (key === "checkOut") {
      if (preferences !== leadPreference) {
        updateAgentPreferences({
          agentID: agentid,
          leadPreference: preferences,
        });
      }
      if (isAvailable) {
        updateAgentAvailability({ agentID: agentid, availability: false });
        setActiveModal("checkOut");
      }
    }
    if (key === "continue") {
      if (preferences !== leadPreference) {
        updateAgentPreferences({
          agentID: agentid,
          leadPreference: preferences,
        });
      }
      if (!isAvailable) {
        updateAgentAvailability({
          agentID: agentid,
          availability: true,
        });
      }
      handleClose();
    }
  };

  const Wrapper = showAsModal ? Modal : Box;

  return (
    <div>
      <Wrapper
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={!showAsModal ? "" : `box ${activeModal}-box-h`}>
          <Fragment>
            {showAsModal && (
              <StyledIconButton
                onClick={() => {
                  handleClose();
                }}
              />
            )}
            {activeModal === "callCenter" && (
              <ModalContactText virtualNumber={virtualNumber} />
            )}
            {activeModal === "main" && !hideModalHeader && (
              <ModalText checkInPreference={checkInPreference} />
            )}
            {activeModal === "leadType" && <LeadText title={"Lead Type"} />}
            {activeModal === "leadSource" && <LeadText title={"Lead Source"} />}
            {activeModal === "checkOut" && <CheckOut />}
            {activeModal && activeModal !== "" && (
              <RenderModalItem
                handleClick={handleClick}
                checkInPreference={checkInPreference}
                activeModal={activeModal}
                handleButtonClick={handleButtonClick}
                handleClose={handleClose}
                preferences={preferences}
                handlePreferences={handlePreferences}
                phone={phone}
                virtualNumber={virtualNumber}
                isAvailable={isAvailable}
                agentId={agentid}
                callForwardNumber={callForwardNumber}
                getAgentAvailability={getAgentAvailability}
              />
            )}
          </Fragment>
        </Box>
      </Wrapper>
    </div>
  );
}
