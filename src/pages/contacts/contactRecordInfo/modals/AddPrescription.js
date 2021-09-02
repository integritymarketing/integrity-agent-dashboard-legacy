import React, { useState, Fragment, useMemo, useEffect, useRef } from "react";
import Typeahead from "react-select/async";
import { components } from "react-select";
import { Select } from "components/ui/Select";
import Modal from "components/ui/modal";
import { Button } from "components/ui/Button";
import Textfield from "components/ui/textfield";
import CloseIcon from "components/icons/close";
import Options from "utils/Options";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import clientService from "services/clientsService";
import analyticsService from "services/analyticsService";
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
    drugName,
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
  const [dosageOptions, setDosageOptions] = useState([]);
  const [dosage, setDosage] = useState();
  const [quantity, setQuantity] = useState();
  const [frequency, setFrequency] = useState();
  const [packageOptions, setPackageOptions] = useState([]);
  const [dosagePackage, setDosagePackage] = useState();

  const selectElementRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      analyticsService.fireEvent("event-modal-appear", {
        modalName: "Add Prescription",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    isOpen && selectElementRef.current.focus();
  }, [selectElementRef, isOpen]);

  useEffect(() => {
    const getDosages = async () => {
      const results = await clientService.getDrugDetails(drugName);
      const dosageOptions = (results?.dosages || []).map((dosage) => ({
        label: dosage.labelName,
        value: dosage,
      }));
      setDosageOptions(dosageOptions);
      if (dosageOptions.length === 1) {
        setDosage(dosageOptions[0].value);
      }
    };
    drugName && getDosages();
  }, [drugName]);

  useEffect(() => {
    if (dosage) {
      const { commonMetricQuantity, commonDaysOfSupply } = dosage;
      const packageOptions = (dosage?.packages || []).map((_package) => ({
        label: `${_package.commonUserQuantity} ${_package.packageDescription}`,
        value: _package,
      }));

      setPackageOptions(packageOptions);
      if (packageOptions.length === 1) {
        setDosagePackage(packageOptions[0].value);
      }
      setQuantity(commonMetricQuantity);
      setFrequency(commonDaysOfSupply);
    }
  }, [dosage]);

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
    setFrequency();
    setDosageOptions([]);
    setPackageOptions([]);
    setDosagePackage();
    onCloseHandler(ev);
  };

  const handleOnPrescriptionSelect = (selectedPrescription) => {
    setDrugName(selectedPrescription);
    setSearchString(null);
  };
  
  const handleQuantity = (e) => setQuantity(e.currentTarget.value);

  const handleAddPrecscription = async () => {
    await onSave({
      dosageRecordID: 0,
      dosageID: dosage?.dosageID,
      quantity: quantity,
      daysOfSupply: 0,
      ndc: drugName?.ndc,
      metricQuantity: quantity,
      userQuantity: frequency,
      selectedPackage: dosagePackage,
    });
    onClose();
  };

  const isFormValid = useMemo(() => {
    return Boolean(
      drugName &&
        quantity &&
        frequency &&
        dosage &&
        (packageOptions.length > 0 ? dosagePackage : true)
    );
  }, [drugName, quantity, frequency, dosage, dosagePackage, packageOptions]);

  const handleCloseDrugname = () => {
    setDrugName("");
    setSearchString("");
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
    <div className="prescription--modal">
      <Modal
        size="lg"
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
            {drugName && (
              <section className="mt-2 mb-2 display--drug--name">
                <div className="icon-align" onClick={handleCloseDrugname}>
                  <CloseIcon />
                </div>
                <div className="pl-2 drug--name">{drugName?.label}</div>
                <div className="pl-2 drug--type">{drugName?.description}</div>
              </section>
            )}
            {!drugName && (
              <div className="form-element">
                <label
                  className="label--prescription form-input__header"
                  htmlFor="prescription-name"
                >
                  Prescription name
                </label>
                <Typeahead
                  openMenuOnFocus
                  autoFocus
                  ref={selectElementRef}
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
                  noOptionsMessage={() => (
                    <div className="no-search-data">
                      <span>
                        {searchString
                          ? "Prescription not found, try a different search"
                          : "Start typing prescription name"}
                      </span>
                    </div>
                  )}
                  menuIsOpen={!drugName}
                />
              </div>
            )}
            {drugName && (
              <>
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
                      options={dosageOptions}
                      placeholder="Prescription dosage"
                      onChange={setDosage}
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
                      onChange={setFrequency}
                    />
                  </div>
                </div>
                {packageOptions?.length > 0 && (
                  <div className="form-element">
                    <label
                      className="label--packaging form-input__header"
                      htmlFor="prescription-packaging"
                    >
                      Packaging
                    </label>
                    <Select
                      id="prescription-packaging"
                      initialValue={dosagePackage}
                      options={packageOptions}
                      placeholder="Prescription Packaging"
                      onChange={setDosagePackage}
                    />
                  </div>
                )}
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
              data-gtm="button-add-prescription"
            />
            <Button
              label="Add Prescription"
              onClick={handleAddPrecscription}
              disabled={!isFormValid}
              data-gtm="button-cancel-prescription"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
