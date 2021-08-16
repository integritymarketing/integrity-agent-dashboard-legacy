import React, { useState, Fragment } from "react";
import Typeahead from "react-select/async";
import { components } from "react-select";
import { Select } from "components/ui/Select";
import Modal from "components/ui/modal";
import { Button } from "components/ui/Button";
import Textfield from "components/ui/textfield";
import Options from "../../../../utils/Options";
import "./modals.scss";

const CustomOption = ({ innerRef, innerProps, data }) => {
  return (
    <div ref={innerRef} {...innerProps}>
      <Options header={data.label} subHeader={data.description} />
    </div>
  );
};

const Menu = (props) => {
  console.log(props);
  const optionsLength = props?.options?.length ?? 0;
  return (
    <Fragment>
      {optionsLength && (
        <div style={{ marginTop: 20, marginBottom: 14 }}>
          <strong>{optionsLength} prescriptions</strong> found.
        </div>
      )}
      <components.Menu {...props}>{props.children}</components.Menu>
    </Fragment>
  );
};

const prescriptionOptions = [
  {
    label: "Prescription one",
    value: "Prescription one",
    description: "Something on secondline",
  },
  {
    label: "Prescription two",
    value: "Prescription two",
    description: "Something on secondline",
  },
  {
    label: "Prescription 3",
    value: "Prescription 3",
    description: "Something on secondline",
  },
  {
    label: "Prescription one",
    value: "Prescription one",
    description: "Something on secondline",
  },
  {
    label: "Prescription two",
    value: "Prescription two",
    description: "Something on secondline",
  },
  {
    label: "Prescription 3",
    value: "Prescription 3",
    description: "Something on secondline",
  },
  {
    label: "Prescription one",
    value: "Prescription one",
    description: "Something on secondline",
  },
  {
    label: "Prescription two",
    value: "Prescription two",
    description: "Something on secondline",
  },
  {
    label: "Prescription 3",
    value: "Prescription 3",
    description: "Something on secondline",
  },
  {
    label: "Prescription one",
    value: "Prescription one",
    description: "Something on secondline",
  },
  {
    label: "Prescription two",
    value: "Prescription two",
    description: "Something on secondline",
  },
  {
    label: "Prescription 3",
    value: "Prescription 3",
    description: "Something on secondline",
  },
];

const FREQUENCY_OPTIONS = [
  { value: "per month", label: "per month" },
  { value: "per two months", label: "per two months" },
  { value: "per three months", label: "per three months" },
  { value: "per year", label: "per year" },
];

export default function AddPrescription({ isOpen, onClose: onCloseHandler }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedDosage, setSelectedDosage] = useState(null);
  const [dosageOptions, setDosageOptions] = useState([]);
  const [quantity, setQuantity] = useState();
  const [frequency, setfrequency] = useState(FREQUENCY_OPTIONS);
  const fetchOptions = async (searchStr) => {
    setSelectedValue(() => null);
    console.log(searchStr);
    // Hit api and return optons.
    return prescriptionOptions;
  };
  const onClose = (ev) => {
    setSelectedValue(null);
    onCloseHandler(ev);
  };
  const handleOnPrescriptionSelect = (selectedPrescription) => {
    // Fetch data related to selectedPrescription.
    setSelectedValue(selectedPrescription);
  };

  const handleQuantity = (e) => setQuantity(e.currentTarget.value)
  
  const handleChange = () => {
    setDosageOptions();
  };

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
                value={selectedValue}
                isClearable={() => selectedValue(null)}
                cacheOptions
                defaultOptions={prescriptionOptions}
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
                  "Prescription not found, try a different search"
                }
                menuIsOpen={!selectedValue}
              />
            </div>
            {selectedValue && (
              <>
                <div className="form-element">
                  <label
                    className="label--dosage form-input__header"
                    htmlFor="prescription-dosage"
                  >
                    Dosage
                  </label>
                  <Select
                    id="prescription-dosage"
                    initialValue={selectedDosage}
                    options={dosageOptions}
                    placeholder="Prescription dosage"
                    disabled={dosageOptions.length === 0}
                    onChange={(value) => setSelectedDosage(value)}
                  />
                </div>
                <div className="form-element quantity-frequency-container">
                  <Textfield
                    id="quantity"
                    type="number"
                    className="quantity"
                    label="Quantity"
                    value={quantity}
                    onChange={handleQuantity}
                  />
                  <div>
                    <label
                      className="label--frequency form-input__header"
                      htmlFor="prescription-frequency"
                    >
                      Frequency
                    </label>
                    <Select
                      id="prescription-frequency"
                      options={frequency}
                      placeholder="Select frequency"
                      onChange={(value) => setSelectedDosage(value)}
                    />
                  </div>
                </div>
                <div className="form-element">
                  <label
                    className="label--packaging form-input__header"
                    htmlFor="prescription-packaging"
                  >
                    Packaging
                  </label>
                  <Select
                    id="prescription-packaging"
                    initialValue={selectedDosage}
                    options={dosageOptions}
                    placeholder="Prescription Packaging"
                    disabled={dosageOptions.length === 0}
                    onChange={(value) => setSelectedDosage(value)}
                  />
                </div>
              </>
            )}
          </div>
          <div className="dialog--actions">
            <Button
              className="mr-1"
              label="Cancel"
              onClick={onClose}
              type="secondary"
            />
            <Button label="Add Prescription" onClick={() => {}} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
