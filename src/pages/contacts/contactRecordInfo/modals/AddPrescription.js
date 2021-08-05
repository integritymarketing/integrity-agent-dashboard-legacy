import React, { useState } from "react";
import Typeahead from "react-select/async";
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

export default function AddPrescription({ isOpen, onClose }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedDosage, setSelectedDosage] = useState(null);
  const [dosageOptions, setDosageOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const fetchOptions = async (searchStr) => {
    console.log(searchStr);
    // Hit api and return optons.
    return prescriptionOptions;
  };

  const handleOnPrescriptionSelect = (selectedPrescription) => {
    // Fetch data related to selectedPrescription.
    setSelectedValue(selectedPrescription);
  };

  const handleChange = () => {
    setQuantity()
    setDosageOptions()
  };

  const colourStyles = {
    placeholder: (defaultStyles) => {
        return {
            ...defaultStyles,
            color: '#64748B',
            fontSize: '16px',
            fontFamily: 'Lato'
        }
    },
    control: defaultStyles => ({
      ...defaultStyles,
      ':hover': {
        color: '#f1f5f9',
        border: "1px solid #c7ccd1",
      },
      boxShadow: "none",
      border: "1px solid #c7ccd1",
    })
}

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
            <h2 id="dialog_help_label" className="add--prescription--modal hdg hdg--2 mb-1">
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
                  Option: CustomOption,
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }}
                placeholder={"Start typing prescription name"}
                noOptionsMessage={() =>
                  "Prescription not found, try a different search"
                }
                menuIsOpen={true}
              />
            </div>
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
                onChange={handleChange}
                disabled={dosageOptions.length === 0}
              />
              <div>
                <label
                  className="label--frequency form-input__header"
                  htmlFor="prescription-dosage"
                >
                  Frequency
                </label>
                <Select
                  id="prescription-dosage"
                  options={dosageOptions}
                  placeholder="Prescription dosage"
                  disabled={dosageOptions.length === 0}
                  onChange={(value) => setSelectedDosage(value)}
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
            <Button label="Add Prescription" onClick={() => {}} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
