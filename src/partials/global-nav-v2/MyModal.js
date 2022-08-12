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
  updateAgentPreferences,
}) {
  const { agentid = "" } = user || {};
  const [activeModal, setActiveModal] = useState("main");
  const [leadType, setLeadType] = useState("");
  const [leadSource, setLeadSource] = useState("");

  useEffect(() => {
    if (open) setActiveModal("main");
  }, [open]);

  const handleClick = (value) => {
    setActiveModal(value);
  };
  const handleButtonClick = (key) => {
    if (key === "checkOut") {
      if (isAvailable) {
        updateAgentAvailability({ agentID: agentid, availability: false });
      }
    }
    if (key === "continue") {
      if (!isAvailable) {
        updateAgentAvailability({
          agentID: agentid,
          availability: true,
        });
        let leadPreference = {
          data: leadType === "dataLead" ? true : false,
          call: leadType === "callLead" ? true : false,
          leadCenter: leadSource === "leadCenter" ? true : false,
          medicareEnrollPurl: leadSource === "pURL" ? true : false,
        };
        updateAgentPreferences({
          agentID: agentid,
          leadPreference: leadPreference,
        });
      }
    }
    handleClose();
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
                leadType={leadType}
                setLeadType={setLeadType}
                leadSource={leadSource}
                setLeadSource={setLeadSource}
                phone={phone}
                virtualNumber={virtualNumber}
                agentId={agentid}
              />
            )}
          </Fragment>
        </Box>
      </Modal>
    </div>
  );
}
