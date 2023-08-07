import React from "react";
import Modal from "components/ui/modal";

const ConfirmationModal = ({ open, title, message, cancelHandler, submitHandler }) => {
  return (
    <Modal open={open} labeledById="dialog_contact_label">
      <div className="customDeletepopup">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="customDeletepopupbtn">
          <button className="cancelbtn" onClick={cancelHandler}>
            cancel
          </button>
          <button className="deletebtn" onClick={submitHandler}>
            delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
