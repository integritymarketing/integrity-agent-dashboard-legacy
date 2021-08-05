import React from "react";
import Modal from "components/ui/modal";

export default function AddProvider({ isOpen, onClose }) {
  return (
    <div>
      <Modal open={isOpen} onClose={onClose} labeledById="dialog_add_provider">
        <div className="dialog--container">
          <div className="dialog--title">
            <h2 id="dialog_help_label" className="hdg hdg--2 mb-1">
              Add Provider
            </h2>
          </div>
          <div className="dialog--body">

          </div>
          <div className="dialog--actions"></div>
        </div>
      </Modal>
    </div>
  );
}
