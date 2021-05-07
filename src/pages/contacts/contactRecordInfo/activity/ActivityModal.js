import React from "react";
import Modal from "components/ui/modal";
import SuccessIcon from "components/icons/success-note";

export default ({ activityModalStatus, setActivityModalStatus, ...props }) => {
  return (
    <div className="customform">
      <Modal
        open={activityModalStatus}
        onClose={setActivityModalStatus}
        labeledById="dialog_contact_label"
      >
        <form action="" className="form" onSubmit={() => {}} noValidate>
          <legend
            className="custom-modal-heading hdg hdg--2 mb-1"
            id="dialog_contact_label"
          >
            <span className="bgcolor-4">
              <SuccessIcon />
            </span>
            <label> New Note</label>
          </legend>
          <div className="newnotepopupformfield form__field">
            <input
              className="acm-ed-fname"
              type="text"
              value=""
              name=""
              placeholder="Activity Title"
            />
          </div>
          <div className="newnotepopupformfield form__field">
            <textarea
              className="acm-ed-fname"
              type="text"
              value=""
              name=""
              placeholder="Activity Title"
            ></textarea>
          </div>
          <div className="newnotepopupformfieldbtn form__submit custom-form-btn">
            <button className="cancel-btn btn" type="submit">
              Cancel
            </button>
            <button className="submit-btn btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
