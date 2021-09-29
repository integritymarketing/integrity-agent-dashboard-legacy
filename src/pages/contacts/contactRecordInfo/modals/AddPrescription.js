import React, { useState, useMemo, useEffect } from "react";
import Media from "react-media";
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

const formatOptionLabel = ({ label, description }) => (
  <Options header={label} subHeader={description} />
);

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
  const [drugNameOptions, setDrugNameOptions] = useState([]);
  const [dosageOptions, setDosageOptions] = useState([]);
  const [dosage, setDosage] = useState();
  const [quantity, setQuantity] = useState();
  const [frequency, setFrequency] = useState();
  const [packageOptions, setPackageOptions] = useState([]);
  const [dosagePackage, setDosagePackage] = useState();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      analyticsService.fireEvent("event-modal-appear", {
        modalName: "Add Prescription",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const getDosages = async () => {
      setLoading(true);
      try {
        const drugID = drugName?.value;
        const results = await clientService.getDrugDetails(drugID);
        const dosageOptions = (results?.dosages || []).map((dosage) => ({
          label: dosage.labelName,
          value: dosage,
        }));
        setDosageOptions(dosageOptions);
        if (dosageOptions.length === 1) {
          setDosage(dosageOptions[0].value);
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };
    drugName && getDosages();
  }, [drugName]);

  useEffect(() => {
    if (dosage) {
      const { commonUserQuantity, commonDaysOfSupply } = dosage;
      const packageOptions = (dosage?.packages || []).map((_package) => ({
        label: `${_package?.packageSize}${_package?.packageSizeUnitOfMeasure} ${_package?.packageDescription}`,
        value: _package,
      }));

      setPackageOptions(packageOptions);
      if (packageOptions.length === 1) {
        setDosagePackage(packageOptions[0].value);
      }
      setQuantity(commonUserQuantity);
      setFrequency(commonDaysOfSupply);
    }
  }, [dosage]);
  const fetchOptions = async (event) => {
    const searchStr = event.target.value;
    setDrugName(() => null);
    setSearchString(searchStr);
    if (searchStr) {
      const drugNameOptions = await clientService.getDrugNames(searchStr);
      const options = (drugNameOptions || []).map(transformPrescriptionOptions);
      setDrugNameOptions(options);
    } else {
      setDrugNameOptions([]);
    }
  };

  const onClose = (ev) => {
    setDrugNameOptions([]);
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

  const handleQuantity = (e) => setQuantity(e.currentTarget.value);

  const handleAddPrecscription = async () => {
    setIsSaving(true);
    try {
      await onSave({
        dosageRecordID: 0,
        dosageID: dosage?.dosageID,
        quantity: quantity,
        daysOfSupply: frequency,
        ndc: dosage?.referenceNDC,
        metricQuantity: quantity,
        selectedPackage: dosagePackage,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
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
    setDrugNameOptions([]);
    setDrugName("");
    setSearchString("");
  };

  return (
    <div className="prescription--modal">
      <Media
        query={"(max-width: 500px)"}
        onChange={(isMobile) => {
          setIsMobile(isMobile);
        }}
      />
      <Modal
        size="lg"
        wide={true}
        open={isOpen}
        onClose={onClose}
        providerModal={isMobile}
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
            {!drugName && !isLoading && (
              <>
                <div className="form-element">
                  <label
                    className="label--prescription form-input__header"
                    htmlFor="prescription-name"
                  >
                    Prescription Search
                  </label>
                  <input
                    className="drugname-search-input"
                    type="text"
                    value={searchString}
                    placeholder="Start typing drug name"
                    onChange={fetchOptions}
                  />
                </div>
                <div className="search-result-count">
                  <b>{drugNameOptions.length} prescriptions </b> found
                </div>
                {drugNameOptions.length === 0 && (
                  <div className="no-search-data">
                    <span>
                      {searchString
                        ? "Prescription not found, try a different search"
                        : "Start typing prescription name"}
                    </span>
                  </div>
                )}
                {drugNameOptions.length > 0 && (
                  <div className="search-options MenuList">
                    {drugNameOptions.map((option, index) => (
                      <div key={index} onClick={() => setDrugName(option)}>
                        {formatOptionLabel(option)}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {drugName && !isLoading && (
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
                      providerModal={true}
                      options={dosageOptions}
                      placeholder="Dosage"
                      onChange={setDosage}
                    />
                  </div>
                  <div className="quantity-frequency-wrapper">
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
                        providerModal={true}
                        initialValue={frequency}
                        id="prescription-frequency"
                        options={FREQUENCY_OPTIONS}
                        placeholder="Frequency"
                        onChange={setFrequency}
                      />
                    </div>
                  </div>
                </div>
                {packageOptions?.length > 0 && (
                  <div className="form-element prescription--packaging">
                    <label
                      className="label--packaging form-input__header"
                      htmlFor="prescription-packaging"
                    >
                      Packaging
                    </label>
                    <Select
                      providerModal={true}
                      id="prescription-packaging"
                      initialValue={dosagePackage}
                      options={packageOptions}
                      placeholder="Packaging"
                      onChange={setDosagePackage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {isMobile ? null : <hr />}
          <div className="dialog--actions">
            <div className="prescription-cancel">
              <Button
                fullWidth={isMobile}
                className="mr-1"
                label="Cancel"
                onClick={onClose}
                type="secondary"
                data-gtm="button-add-prescription"
              />
            </div>
            <div className="prescription-add">
              {" "}
              <Button
                fullWidth={isMobile}
                label="Add Prescription"
                onClick={handleAddPrecscription}
                disabled={!isFormValid || isSaving}
                data-gtm="button-cancel-prescription"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
