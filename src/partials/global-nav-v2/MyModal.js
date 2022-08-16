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
  handleClose,
  isAvailable,
  open,
  phone,
  virtualNumber,
  updateAgentAvailability,
  user,
  leadPreference,
  updateAgentPreferences,
  callForwardNumber,
}) {
  const { agentid = "" } = user || {};
  const [activeModal, setActiveModal] = useState("main");
  const [preferences, setPreferences] = useState({
    data: false,
    call: false,
    leadCenter: false,
    medicareEnrollPurl: false,
  });

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
    setPreferences(leadPreference);
  }, [leadPreference]);

  const handleClick = (value) => {
    setActiveModal(value);
  };
  const handleButtonClick = (key) => {
    if (key === "checkOut") {
      if (isAvailable) {
        updateAgentAvailability({ agentID: agentid, availability: false });
        setActiveModal("checkOut");
      }
    }
    if (key === "continue") {
      if (!isAvailable) {
        updateAgentAvailability({
          agentID: agentid,
          availability: true,
        });

        updateAgentPreferences({
          agentID: agentid,
          leadPreference: preferences,
        });
      }
      handleClose();
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={`box ${activeModal}-box-h`}>
          <Fragment>
            <StyledIconButton
              onClick={() => {
                handleClose();
              }}
            />
            {activeModal === "callCenter" && (
              <ModalContactText virtualNumber={virtualNumber} />
            )}
            {activeModal === "main" && <ModalText />}
            {activeModal === "leadType" && <LeadText title={"Lead Type"} />}
            {activeModal === "leadSource" && <LeadText title={"Lead Source"} />}
            {activeModal === "checkOut" && <CheckOut />}
            {activeModal && activeModal !== "" && (
              <RenderModalItem
                handleClick={handleClick}
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
              />
            )}
          </Fragment>
        </Box>
      </Modal>
    </div>
  );
}
