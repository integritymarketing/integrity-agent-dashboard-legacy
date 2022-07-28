import React, { useState, Fragment } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Lead from "./Lead.svg";
import Mobile from "./Mobile.svg";
import Office from "./Office.svg";
import Home from "./Home.svg";
import RenderModalItem from "./renderModalItem";
import ModalText from "./ModalText";
import ModalContactText from "./ModalContactText";
import "./myModal.scss";

const MODAL_PHONE_ITEMS = {
  Mobile: {
    title: "Mobile",
    icon: Mobile,
    phoneNumber: "801-867-5309",
  },
  Office: {
    title: "Office",
    icon: Office,
    phoneNumber: "800-273-8255",
  },
  Home: {
    title: "Home",
    icon: Home,
    phoneNumber: "801-555-1234",
  },
};

const MODAL_LEAD_TYPE = [
  {
    title: "Lead Type",
    type: "Call",
    icon: Lead,
  },
];

const MODAL_BUTTON = [
  {
    text: "Check Out",
    key: "checkOut",
    className: 'modal_button',
  },
  { text: "Continue", key: "continue", className: '' },
];

export default function BasicModal({
  handleClose,
  isAvailable,
  open,
  phone,
  updateAgentAvailability,
  user,
}) {
  const { agentid = "" } = user || {};
  MODAL_PHONE_ITEMS["Mobile"].phoneNumber = phone;
  const [activePhone, setActivePhone] = useState("Mobile");
  const [isOpenPhoneList, setIsOpenPhoneList] = useState(false);
  const handleClick = ({ type, value }) => {
    if (type === "phoneList") {
      setActivePhone(value);
    }
  };
  const handleButtonClick = (key) => {
    if (key === MODAL_BUTTON[0].key) {
      if (isAvailable) {
        updateAgentAvailability({ agentID: agentid, availability: false });
      }
    }
    if (key === MODAL_BUTTON[1].key) {
      if (!isAvailable) {
        updateAgentAvailability({ agentID: agentid, availability: true });
      }
    }
    handleClose();
  };
  const handleOpenPhone = () => {
    setIsOpenPhoneList(true);
  };
  const handleClosePhone = () => {
    setIsOpenPhoneList(false);
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='box'>
          {isOpenPhoneList ? (
            <Fragment>
              <ModalContactText handleClosePhone={handleClosePhone} />
              <RenderModalItem
                renderType={"phoneList"}
                handleClick={handleClick}
                activedPhone={activePhone}
                handleOpenPhone={handleOpenPhone}
                dataSource={MODAL_PHONE_ITEMS}
              />
            </Fragment>
          ) : (
            <Fragment>
              <ModalText />
              <RenderModalItem
                handleClick={handleClick}
                handleOpenPhone={handleOpenPhone}
                {...MODAL_PHONE_ITEMS[activePhone]}
                MODAL_LEAD_TYPE={MODAL_LEAD_TYPE}
              />

              <div className="itemBox">
                {MODAL_BUTTON.map((item) => {
                  return (
                    <div
                      key={item.key}
                      onClick={() => {
                        handleButtonClick(item.key);
                      }}
                      className={`item ${item.className}`}
                     
                    >
                      {item.text}
                    </div>
                  );
                })}
              </div>
            </Fragment>
          )}
        </Box>
      </Modal>
    </div>
  );
}
