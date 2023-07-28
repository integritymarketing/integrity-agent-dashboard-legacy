import React, { useState, useEffect, useMemo } from "react";
import { Typography } from "@material-ui/core";
import ErrorState from "./ErrorState";
import Modal from "components/Modal";

import clientService from "services/clientsService";
import SearchPrescription from "./SearchPrescription";
import PrescriptionList from "./PrescriptionList";
import PrescriptionForm from "./PrescriptionForm";
import "./style.scss";

const transformPrescriptionOptions = (option) => {
  const {
    drugName,
    drugType,
    drugID,
    referenceNDC,
    genericDrugID,
    genericDrugType,
    genericDrugName,
  } = option;
  return {
    label: drugName,
    drugName,
    description: drugType,
    value: drugID,
    ndc: referenceNDC,
    g_value: genericDrugID,
    g_description: genericDrugType ? genericDrugType : "Generic",
    g_label: genericDrugName,
  };
};

const frontTruncate = (str, maxChars, replacement = "...") => {
  if (str.length > maxChars) {
    let value =
      str.slice(0, 14) + replacement + str.slice(str.length - 13, str.length);
    return value;
  }
  return str;
};

export default function PrescriptionModal({
  onSave,
  onClose: onCloseHandler,
  open,
}) {
  const [selectedDrug, onDrugSelection] = useState("");
  const [searchString, setSearchString] = useState("");
  const [prescriptionList, setprescriptionList] = useState([]);
  const [dosageOptions, setDosageOptions] = useState([]);
  const [dosage, setDosage] = useState();
  const [quantity, setQuantity] = useState();
  const [frequency, setFrequency] = useState();
  const [packageOptions, setPackageOptions] = useState([]);
  const [dosagePackage, setDosagePackage] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedGenericDrug, setSelectedGenericDrug] = useState(false);

  useEffect(() => {
    const getDosages = async () => {
      debugger;

      setLoading(true);
      try {
        const drugID = selectedGenericDrug
          ? selectedDrug?.g_value
          : selectedDrug?.value;
        const results = await clientService.getDrugDetails(drugID);
        const dosageOptions = (results?.dosages || []).map((dosage) => ({
          label: frontTruncate(dosage.labelName, 34),
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
    selectedDrug && getDosages();
  }, [selectedDrug, selectedGenericDrug]);

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
      } else {
        setDosagePackage(null);
      }
      setQuantity(commonUserQuantity);
      setFrequency(commonDaysOfSupply);
    }
  }, [dosage]);

  const fetchOptions = async (event) => {
    const searchStr = event.target.value;
    onDrugSelection(null);
    setSelectedGenericDrug(false);
    setSearchString(searchStr);
    if (searchStr && searchStr.length > 1) {
      const prescriptionList = await clientService.getDrugNames(searchStr);
      const options = (prescriptionList || []).map(
        transformPrescriptionOptions
      );
      setprescriptionList(options);
    } else {
      setprescriptionList([]);
    }
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
        ndc: dosagePackage ? dosagePackage?.referenceNDC : dosage?.referenceNDC,
        metricQuantity: quantity * (dosagePackage?.commonMetricQuantity ?? 1),
        selectedPackage: null,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = useMemo(() => {
    return Boolean(
      selectedDrug &&
        quantity &&
        frequency &&
        dosage &&
        (packageOptions.length > 0 ? dosagePackage : true)
    );
  }, [
    selectedDrug,
    quantity,
    frequency,
    dosage,
    dosagePackage,
    packageOptions,
  ]);

  const onClose = (ev) => {
    setprescriptionList([]);
    onDrugSelection("");
    setSearchString("");
    setDosage();
    setQuantity();
    setFrequency();
    setDosageOptions([]);
    setPackageOptions([]);
    setDosagePackage();
    onCloseHandler(ev);
  };

  const ERROR_STATE =
    searchString?.length === 0 || prescriptionList?.length === 0;

  console.log("HHHHH", selectedDrug);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Prescriptions"
      onSave={handleAddPrecscription}
      actionButtonName="Add Prescription"
      input={searchString}
      actionButtonDisabled={!isFormValid || isSaving}
    >
      {!selectedDrug && !isLoading ? (
        <>
          <SearchPrescription
            searchString={searchString}
            prescriptionList={prescriptionList}
            handleSearch={fetchOptions}
          />

          {ERROR_STATE ? (
            <ErrorState
              searchString={searchString}
              prescriptionList={prescriptionList}
            />
          ) : (
            <PrescriptionList
              prescriptionList={prescriptionList}
              onDrugSelection={onDrugSelection}
              selected={selectedDrug}
            />
          )}
        </>
      ) : (
        <>
          <PrescriptionList
            prescriptionList={[{ ...selectedDrug }]}
            onDrugSelection={() => setSelectedGenericDrug(false)}
            selected={!selectedGenericDrug}
          />

          {selectedDrug.g_value && selectedDrug?.description === "Brand" && (
            <>
              <Typography
                style={{
                  color: "#052A63",
                  fontSize: 20,
                  fontFamily: "Lato",
                  letterSpacing: "0.2px",
                  marginTop: 20,
                }}
              >
                Would you like to use the Generic Version?
              </Typography>
              <Typography
                style={{
                  color: "#434A51",
                  fontSize: 16,
                  fontFamily: "Lato",
                  letterSpacing: "0.16px",
                  marginTop: 10,
                }}
              >
                According to the FDA, this generic drug has the same quality,
                strength, safety and active ingredient as the brand name drug.
              </Typography>

              <PrescriptionList
                prescriptionList={[
                  {
                    ...selectedDrug,
                    description: selectedDrug.g_description,
                    label: selectedDrug.g_label,
                  },
                ]}
                onDrugSelection={() => setSelectedGenericDrug(true)}
                selected={selectedGenericDrug}
              />
            </>
          )}
          <PrescriptionForm
            {...{
              dosage,
              quantity,
              frequency,
              dosageOptions,
              handleQuantity,
              setFrequency,
              setDosage,
            }}
          />
          {/* <div className="inputGroup">
          
            <Box
              display={{ xs: "none", md: "flex" }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box sx={{ width: "45%" }}>
                <Typography
                  marginBottom={10}
                  className={classes.customTypography}
                >
                  Dosage
                </Typography>
                <Select
                  initialValue={dosage}
                  providerModal={true}
                  options={dosageOptions}
                  placeholder="Dosage"
                  onChange={setDosage}
                />
              </Box>
              <Box sx={{ width: "10%" }}>
                <Typography
                  marginBottom={10}
                  className={classes.customTypography}
                >
                  Quantity
                </Typography>
                <TextField
                  id="Quantity"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={quantity}
                  onChange={handleQuantity}
                />
              </Box>
              <Box sx={{ width: "35%" }}>
                <Typography
                  marginBottom={10}
                  className={classes.customTypography}
                >
                  Frequency
                </Typography>
                <Select
                  providerModal={true}
                  initialValue={frequency}
                  options={FREQUENCY_OPTIONS}
                  placeholder="Frequency"
                  onChange={setFrequency}
                />
              </Box>
            </Box>

      
            <Box display={{ xs: "flex", md: "none" }} flexDirection="column">
              <Box sx={{ width: "100%" }}>
                <Typography
                  marginBottom={10}
                  className={classes.customTypography}
                >
                  Dosage
                </Typography>
                <Select
                  initialValue={dosage}
                  providerModal={true}
                  options={dosageOptions}
                  placeholder="Dosage"
                  onChange={setDosage}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ width: "25%" }}>
                  <Typography
                    marginBottom={10}
                    className={classes.customTypography}
                  >
                    Quantity
                  </Typography>
                  <TextField
                    id="Quantity"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={quantity}
                    onChange={handleQuantity}
                  />
                </Box>
                <Box sx={{ width: "70%" }}>
                  <Typography
                    marginBottom={10}
                    className={classes.customTypography}
                  >
                    Frequency
                  </Typography>
                  <Select
                    providerModal={true}
                    initialValue={frequency}
                    options={FREQUENCY_OPTIONS}
                    placeholder="Frequency"
                    onChange={setFrequency}
                  />
                </Box>
              </Box>
            </Box>
          </div> */}
        </>
      )}
    </Modal>
  );
}
