import React, { useState } from "react";
import Modal from "components/ui/modal";
import { Button } from "components/ui/Button";
import { Select } from "components/ui/Select";
import Textfield from "components/ui/textfield";
import "./modals.scss";

export default function AddPharmacy({ isOpen, onClose }) {
  const [distanceOptions, setDistanceOptions] = useState([]);
  const handleChange = () => {};
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        labeledById="dialog_add_pharmacy"
        size="lg"
      >
        <div className="dialog--container">
          <div className="dialog--title">
            <h2 id="dialog_help_label" className="hdg hdg--2 mb-1">
              Add Pharmacy
            </h2>
          </div>
          <div className="dialog--body">
            <div className="form-element pharmacy-container">
              <Textfield
                id="zipCode"
                type="text"
                className="pharmacy--zip--code mr-1"
                label="ZIP Code"
                value={123}
                onChange={handleChange}
                disabled={false}
              />
              <Textfield
                id="pharmacyName"
                type="text"
                className="pharmacy--name  mr-1"
                label="Pharmacy Name"
                value={"hello"}
                onChange={handleChange}
                disabled={false}
              />
              <Textfield
                id="pharmacyAddress"
                type="text"
                className="pharmacy--address mr-1"
                label="Pharmacy Address"
                value={"hello"}
                onChange={handleChange}
                disabled={false}
              />
              <div>
                <label
                  className="label--distance form-input__header"
                  htmlFor="pharmacy--distance"
                >
                  Distance
                </label>
                <Select
                  id="pharmacy--distance"
                  options={distanceOptions}
                  onChange={(value) => setDistanceOptions(value)}
                />
              </div>
            </div>
          </div>
          <div className="dialog--actions">
            <Button
              className="mr-1"
              label="Cancel"
              onClick={() => {}}
              type="secondary"
            />
            <Button label="Save Changes" onClick={() => {}} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
