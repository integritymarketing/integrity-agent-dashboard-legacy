import React, { useState, useMemo, useEffect } from "react";
import { Select } from "components/ui/Select";
import Modal from "components/ui/modal";
import { Button } from "components/ui/Button";
import Textfield from "components/ui/textfield";
import "./modals.scss";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import DOSAGE_OPTIONS from "utils/dosageOptions";
import analyticsService from "services/analyticsService";

export default function EditPrescription({
  isOpen,
  onClose: onCloseHandler,
  item,
  onSave,
}) {
  useEffect(() => {
    if (isOpen) {
      analyticsService.fireEvent("event-modal-appear", {
        modalName: "Edit Prescription",
      });
    }
  }, [isOpen]);

  const { drugName, drugType } = item;
  const [dosage, setDosage] = useState();
  const [quantity, setQuantity] = useState();
  const [frequency, setfrequency] = useState();

  const onClose = (ev) => {
    setDosage();
    setQuantity();
    setfrequency();
    onCloseHandler(ev);
  };
  const handleQuantity = (e) => setQuantity(e.currentTarget.value);
  const handleSave = async () => {
    await onSave({
      ...item,
      quantity,
      frequency,
    });
    onClose();
  };

  const isFormEdit = useMemo(() => {
    return Boolean(quantity && frequency && dosage);
  }, [quantity, frequency, dosage]);

  return (
    <div className="prescription--modal">
      <Modal
        size="lg"
        wide={true}
        open={isOpen}
        onClose={onClose}
        labeledById="dialog_edit_prescription"
      >
        <div className="dialog--container">
          <div className="dialog--title">
            <h2
              id="dialog_help_label"
              className="add--prescription--modal hdg hdg--2 mb-1"
            >
              Edit Prescription
            </h2>
          </div>
          <div className="dialog--body">
            <section className="mt-2 mb-2 display--drug--name">
              <div className="pt-2 pl-2 drug--name">{drugName}</div>
              <div className="pl-2 drug--type">{drugType}</div>
            </section>
            <div className="prescription__wrapper">
              <div className="form-element prescription--dosage">
                <label
                  className="label--dosage form-input__header"
                  htmlFor="prescription-dosage"
                >
                  Dosage
                </label>
                <Select
                  id="prescription-dosage"
                  initialValue={dosage}
                  options={DOSAGE_OPTIONS}
                  labelPrefix={`${drugName} tablet `}
                  prefix={`${drugName} tablet`}
                  placeholder="Prescription dosage"
                  onChange={(value) => setDosage(value)}
                />
              </div>
              <div className="form-element prescription--quantity">
                <Textfield
                  id="quantity"
                  className="quantity"
                  label="Quantity"
                  value={quantity}
                  onChange={handleQuantity}
                />
              </div>
              <div className="form-element prescription--frequency">
                <label
                  className="label--frequency form-input__header"
                  htmlFor="prescription-frequency"
                >
                  Frequency
                </label>
                <Select
                  initialValue={frequency}
                  id="prescription-frequency"
                  options={FREQUENCY_OPTIONS}
                  placeholder="Select"
                  onChange={(value) => setfrequency(value)}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="dialog--actions">
            <Button
              className="mr-2"
              label="Cancel"
              onClick={onClose}
              type="secondary"
              data-gtm="button-save"
            />
            <Button
              label="Save Changes"
              onClick={handleSave}
              disabled={!isFormEdit}
              data-gtm="button-cancel"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
