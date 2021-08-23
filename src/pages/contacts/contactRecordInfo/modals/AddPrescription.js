import React, { useState, Fragment, useMemo } from "react";
import Typeahead from "react-select/async";
import { components } from "react-select";
import { Select } from "components/ui/Select";
import Modal from "components/ui/modal";
import { Button } from "components/ui/Button";
import Textfield from "components/ui/textfield";
import Options from "utils/Options";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import DOSAGE_OPTIONS from "utils/dosageOptions";
import clientService from "services/clientsService";
import "./modals.scss";

const CustomOption = ({ innerRef, innerProps, data }) => {
  return (
    <div ref={innerRef} {...innerProps}>
      <Options header={data.label} subHeader={data.description} />
    </div>
  );
};

const Menu = (props) => {
  const optionsLength = props?.options?.length ?? 0;
  return (
    <Fragment>
      {optionsLength ? (
        <div style={{ marginTop: 20, marginBottom: 14 }}>
          <strong>{optionsLength} prescriptions</strong> found
        </div>
      ) : (
        ""
      )}
      <components.Menu {...props}>{props.children}</components.Menu>
    </Fragment>
  );
};

const transformPrescriptionOptions = (option) => {
  const { drugName, drugType, drugID, referenceNDC } = option;
  return {
    label: drugName,
    description: drugType,
    value: drugID,
    ndc: referenceNDC,
  };
};

export default function AddPrescription({
  isOpen,
  onClose: onCloseHandler,
  onSave,
}) {
  const [drugName, setDrugName] = useState("");
  const [searchString, setSearchString] = useState("");
  const [dosage, setDosage] = useState();
  const [quantity, setQuantity] = useState();
  const [frequency, setfrequency] = useState();

  const fetchOptions = async (searchStr) => {
    setDrugName(() => null);
    setSearchString(searchStr);
    const drugNameOptions = await clientService.getDrugNames(searchStr);
    return (drugNameOptions || []).map(transformPrescriptionOptions);
  };

  const onClose = (ev) => {
    setDrugName("");
    setSearchString("");
    setDosage();
    setQuantity();
    setfrequency();
    onCloseHandler(ev);
  };

  const handleOnPrescriptionSelect = (selectedPrescription) => {
    setDrugName(selectedPrescription);
    setSearchString(null);
  };

  const handleQuantity = (e) => setQuantity(e.currentTarget.value);

  const handleAddPrecscription = async () => {
    await onSave({
      drugID: drugName?.value,
      dosageID: dosage,
      quantity: quantity,
      frequency: frequency,
      daysOfSupply: 0,
      ndc: drugName?.ndc,
    });
    onClose();
  };

  const isFormValid = useMemo(() => {
    return Boolean(drugName && quantity && frequency && dosage);
  }, [drugName, quantity, frequency, dosage]);

  const colourStyles = {
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#64748B",
        fontSize: "16px",
        fontFamily: "Lato",
      };
    },
    control: (defaultStyles) => ({
      ...defaultStyles,
      ":hover": {
        color: "#f1f5f9",
        border: "1px solid #c7ccd1",
      },
      boxShadow: "none",
      border: "1px solid #c7ccd1",
    }),
  };

  return (
    <div>
      <Modal
        wide={true}
        open={isOpen}
        onClose={onClose}
        labeledById="dialog_add_prescription"
      >
        <div className="dialog--container">
          <div className="dialog--title">
            <h2
              id="dialog_help_label"
              className="add--prescription--modal hdg hdg--2 mb-1"
            >
              Add Prescription
            </h2>
          </div>
          <div className="dialog--body">
            <div className="form-element">
              <label
                className="label--prescription form-input__header"
                htmlFor="prescription-name"
              >
                Prescription name
              </label>
              <Typeahead
                id="prescription-name"
                styles={colourStyles}
                className="react--select-overide"
                menuPosition="fixed"
                value={drugName}
                isClearable
                loadOptions={fetchOptions}
                onChange={handleOnPrescriptionSelect}
                components={{
                  Menu,
                  Option: CustomOption,
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder={"Start typing prescription name"}
                noOptionsMessage={() =>
                  searchString
                    ? "Prescription not found, try a different search"
                    : "Start typing prescription name"
                }
                menuIsOpen={!drugName}
              />
            </div>
            {drugName && (
              <>
                <div className="edit--prescription__wrapper">
                  <div className="form-element edit--prescription--dosage">
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
                      labelPrefix={`${drugName?.label} tablet `}
                      prefix={`${drugName?.label} tablet`}
                      placeholder="Prescription dosage"
                      onChange={setDosage}
                    />
                  </div>
                  <div className="form-element edit--prescription--quantity">
                    <Textfield
                      id="quantity"
                      className="quantity"
                      label="Quantity"
                      value={quantity}
                      onChange={handleQuantity}
                    />
                  </div>
                  <div className="form-element edit--prescription--frequency">
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
                      placeholder="Select frequency"
                      onChange={setfrequency}
                    />
                  </div>
                </div>
                {/*<div className="form-element">
                  <label
                    className="label--packaging form-input__header"
                    htmlFor="prescription-packaging"
                  >
                    Packaging
                  </label>
                  <Select
                    id="prescription-packaging"
                    initialValue={dosage}
                    options={dosageOptions}
                    placeholder="Prescription Packaging"
                    disabled={dosageOptions.length === 0}
                    onChange={(value) => setDosage(value)}
                  />
                </div> */}
              </>
            )}
          </div>
          <hr />
          <div className="dialog--actions">
            <Button
              className="mr-1"
              label="Cancel"
              onClick={onClose}
              type="secondary"
            />
            <Button
              label="Add Prescription"
              onClick={handleAddPrecscription}
              disabled={!isFormValid}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
