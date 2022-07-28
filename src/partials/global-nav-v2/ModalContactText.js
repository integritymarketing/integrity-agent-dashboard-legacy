import React from "react";
import back from "./back.svg";
import './ModalContactText.scss'

const MODAL_TEXT = {
  TITLE: "Contact",
  BACK_TITLE: "Check In",
};

function ModalContactText({ handleClosePhone }) {
  return (
    <div className='ModalContactTextBox'>
      <div
        className='modal_title'
        
      >
        <div
          onClick={handleClosePhone}
          className='close_phone'
        >
          <img className='icon' alt="back" src={back} />
          <span class='back_title'>
            {MODAL_TEXT.BACK_TITLE}
          </span>
        </div>

        <span className='title'>
          {MODAL_TEXT.TITLE}
        </span>
      </div>
    </div>
  );
}
export default ModalContactText;
