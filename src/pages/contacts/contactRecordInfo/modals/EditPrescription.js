import React, { useState, useEffect } from "react";
import Media from "react-media";
import { Select } from "components/ui/Select";
import Modal from "components/ui/modal";
import { Button } from "components/ui/Button";
import Textfield from "components/ui/textfield";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import analyticsService from "services/analyticsService";
import clientService from "services/clientsService";
import "./modals.scss";

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

  const { drugName, drugType, labelName, metricQuantity, daysOfSupply } =
    item?.dosage ?? {};
  const [dosage, setDosage] = useState();
  const [dosageOptions, setDosageOptions] = useState([]);
  const [quantity, setQuantity] = useState(metricQuantity);
  const [frequency, setfrequency] = useState(daysOfSupply);
  const [packageOptions, setPackageOptions] = useState([]);
  const [dosagePackage, setDosagePackage] = useState();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity((q) => q || metricQuantity);
      setfrequency((f) => f || daysOfSupply);
    }
  }, [metricQuantity, daysOfSupply, isOpen]);

  useEffect(() => {
    if (item && isOpen) {
      const packageOptions = (item?.dosage?.packages || []).map((_package) => ({
        label: `${_package.commonUserQuantity} ${_package.packageDescription}`,
        value: _package,
      }));

      setPackageOptions(packageOptions);

      const selectedPackage = packageOptions
        .filter(
          (packageOption) =>
            packageOption?.value?.packageId ===
            item?.dosage?.selectedPackage?.packageId
        )
        .map((opt) => opt.value)[0];
      setDosagePackage(selectedPackage);
    }
  }, [item, isOpen]);

  const onClose = (ev) => {
    setDosage();
    setQuantity();
    setDosageOptions();
    setPackageOptions();
    setDosagePackage();
    setfrequency();
    onCloseHandler(ev);
  };
  const handleQuantity = (e) => setQuantity(e.currentTarget.value);
  const handleSave = async () => {
    await onSave({
      dosageRecordID: item?.dosage?.dosageRecordID,
      labelName: dosage?.labelName,
      metricQuantity: +quantity,
      daysOfSupply: +frequency,
      selectedPackage:
        dosagePackage?.packageId !== item?.dosage?.selectedPackage?.packageId
          ? dosagePackage
          : null,
    });
    onClose();
  };

  useEffect(() => {
    const getDosages = async () => {
      const results = await clientService.getDrugDetails(item?.dosage);
      const dosageOptions = (results?.dosages || []).map((dosage) => ({
        label: dosage.labelName,
        value: dosage,
      }));
      setDosageOptions(dosageOptions);
      setDosage(
        dosageOptions
          .filter(
            (dosageOption) => dosageOption?.value?.labelName === labelName
          )
          .map((opt) => opt.value)[0]
      );
    };
    drugName && isOpen && getDosages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drugName, isOpen]);

  /* Commenting this function becuase we dont have comparission between old package  & new one */
  /*   const isFormValid = useMemo(() => {
    return (
      Boolean(
        quantity &&
          frequency &&
          dosage &&
          (packageOptions.length > 0 ? dosagePackage : true)
      ) &&
      Boolean(
        +quantity !== metricQuantity ||
          +frequency !== daysOfSupply ||
          dosage?.labelName !== labelName ||
          dosagePackage?.packageID !== item?.dosage?.selectedPackage?.packageID
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, frequency, dosage, dosagePackage, packageOptions]); */

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
                  providerModal={true}
                  id="prescription-dosage"
                  initialValue={dosage}
                  options={dosageOptions}
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
                    placeholder="Select"
                    onChange={(value) => setfrequency(value)}
                  />
                </div>
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
                  providerModal={true}
                  id="prescription-packaging"
                  initialValue={dosagePackage}
                  options={packageOptions}
                  placeholder="Prescription Packaging"
                  onChange={setDosagePackage}
                />
              </div>
            )}
          </div>
          {isMobile ? null : <hr />}
          <div className="dialog--actions">
            <Button
              className="mr-2"
              label="Cancel"
              onClick={onClose}
              type="secondary"
              data-gtm="button-update-prescription"
            />
            <Button
              label="Save Changes"
              onClick={handleSave}
              /*disabled={!isFormValid}*/
              data-gtm="button-cancel-update-prescription"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
