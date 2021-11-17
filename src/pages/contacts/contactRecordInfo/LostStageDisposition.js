import React, { useState } from "react";
import { Select } from "components/ui/Select";
import { Button } from "components/ui/Button";
import Modal from "components/ui/modal";
import "./lostStageDisposition.scss";

export default ({ subStatuses = [], open, onClose: handleCloseModal, onSubmit }) => {
  const [subSelect, setSubSelect] = useState(null);

  const handlOnSubmit = (ev) => {
    ev.preventDefault();
    onSubmit &&
      onSubmit(
        "Lost",
        subStatuses.filter(({ value }) => value === subSelect).map(
          ({ value, label }) => ({
            leadStatusId: value,
            leadStatusName: label,
          })
        )
      );
  };
  const handleOnClose = () => {
    setSubSelect(null);
    handleCloseModal();
  };

  return (
    <div className="lost-stage-page">
      <Modal
        open={open}
        size="small"
        cssClassName={"loaststage-modal"}
        onClose={handleOnClose}
      >
        <div className="loaststage-modal dialog--container">
          <div className="dialog--title ">
            <h2 id="dialog_help_label" className="hdg hdg--2 mb-1 mble-title">
            Lost Contact
            </h2>
          </div>
          <label className="label-reason pb-2" htmlFor="reason-label">
            Select the reason why
          </label>
          {open && (
            <Select
              containerHeight={250}
              className="mr-2"
              options={subStatuses}
              placeholder="Select"
              showValueAlways={true}
              onChange={setSubSelect}
            />
          )}
        </div>
        <div className="footer">
          <Button
            disabled={!subSelect}
            label="Submit"
            onClick={handlOnSubmit}
          />
          <Button label="Cancel" onClick={handleOnClose} type="secondary" />
        </div>
      </Modal>
    </div>
  );
};
