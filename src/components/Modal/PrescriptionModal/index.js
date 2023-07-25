import React, { useState, useEffect, useMemo } from "react";
import {
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Radio,
  TextField,
  Typography,
  Box,
} from "@material-ui/core";
import Modal from "../Modal";

import SearchIcon from "../Icons/SearchIcon";
import { Select } from "components/ui/Select";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import clientService from "services/clientsService";

import "./style.scss";

const useStyles = makeStyles((theme) => ({
  primary: {
    color: "#434A51",
    fontFamily: "Lato",
    fontSize: "16px",
    letterSpacing: "0.16px",
  },
  radio: {
    background: "transparent",
    color: "#434A51",
    "&.Mui-checked": {
      color: "#4178FF",
    },
  },
  secondary: {
    color: "#717171",
    fontFamily: "Lato",
    fontSize: "14px",
  },
  customTypography: {
    color: "#052A63",
    fontSize: 16,
    fontFamily: "Lato",
    letterSpacing: "0.16px",
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    "&.MuiOutlinedInput-input": {
      padding: "10px 14px",
    },
  },
}));

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
  const classes = useStyles();

  const [drugName, setDrugName] = useState("");
  const [searchString, setSearchString] = useState("");
  const [drugNameOptions, setDrugNameOptions] = useState([]);
  const [dosageOptions, setDosageOptions] = useState([]);
  const [dosage, setDosage] = useState();
  const [quantity, setQuantity] = useState();
  const [frequency, setFrequency] = useState();
  const [packageOptions, setPackageOptions] = useState([]);
  const [dosagePackage, setDosagePackage] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const getDosages = async () => {
      setLoading(true);
      try {
        const drugID = drugName?.value;
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
      } else {
        setDosagePackage(null);
      }
      setQuantity(commonUserQuantity);
      setFrequency(commonDaysOfSupply);
    }
  }, [dosage]);

  const fetchOptions = async (event) => {
    const searchStr = event.target.value;
    setDrugName(() => null);
    setSearchString(searchStr);
    if (searchStr && searchStr.length > 1) {
      const drugNameOptions = await clientService.getDrugNames(searchStr);
      const options = (drugNameOptions || []).map(transformPrescriptionOptions);
      setDrugNameOptions(options);
    } else {
      setDrugNameOptions([]);
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
      drugName &&
        quantity &&
        frequency &&
        dosage &&
        (packageOptions.length > 0 ? dosagePackage : true)
    );
  }, [drugName, quantity, frequency, dosage, dosagePackage, packageOptions]);

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

  const ERROR_STATE =
    searchString?.length === 0 || drugNameOptions?.length === 0;

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
      {!drugName && !isLoading ? (
        <>
          <Typography
            style={{
              color: "#052A63",
              fontSize: 20,
              fontFamily: "Lato",
              letterSpacing: "0.2px",
              marginTop: 12,
            }}
          >
            Search for a Prescription
          </Typography>
          <TextField
            margin="dense"
            id="prescription"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="Search"
            value={searchString}
            onChange={fetchOptions}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid var(--gray-lt-dddddd)",
              borderRadius: 4,
              width: "100%",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Typography
            style={{
              color: "#717171",
              fontSize: 14,
              fontFamily: "Lato, Italic",
              letterSpacing: "0.14px",
            }}
          >
            {drugNameOptions.length} Prescriptions found
          </Typography>

          {ERROR_STATE ? (
            <Typography
              style={{
                alignItems: "center",
                backgroundColor: "#DDDDDD",
                borderRadius: 8,
                color: "#434A51",
                display: "flex",
                fontSize: 16,
                fontFamily: "Lato",
                height: "100px",
                justifyContent: "center",
                letterSpacing: "0.16px",
                marginTop: 10,
                padding: "20px",
              }}
            >
              {searchString.length > 0 &&
                drugNameOptions?.length === 0 &&
                "Prescription not found, try a different search"}
              {searchString?.length === 0 && "Search for a prescription"}
            </Typography>
          ) : (
            <List>
              {drugNameOptions.map((drug, index) => (
                <ListItem
                  key={index}
                  button
                  selected={drugName === drug}
                  onClick={() => setDrugName(drug)}
                >
                  <Radio
                    disableRipple
                    checked={drugName === drug}
                    onClick={() => setDrugName(drug)}
                    classes={{ root: classes.radio, checked: classes.checked }}
                  />
                  <ListItemText
                    primary={
                      <span className={classes.primary}>{drug.label}</span>
                    }
                    secondary={
                      <span className={classes.secondary}>
                        {drug.description}
                      </span>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </>
      ) : (
        <>
          <List>
            <ListItem button selected={true}>
              <Radio
                disableRipple
                checked={true}
                classes={{ root: classes.radio, checked: classes.checked }}
              />
              <ListItemText
                primary={
                  <span className={classes.primary}>{drugName.label}</span>
                }
                secondary={
                  <span className={classes.secondary}>
                    {drugName.description}
                  </span>
                }
              />
            </ListItem>
          </List>

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

          <List>
            <ListItem button selected={false}>
              <Radio
                disableRipple
                checked={false}
                classes={{ root: classes.radio, checked: classes.checked }}
              />
              <ListItemText
                primary={
                  <span className={classes.primary}>{drugName.label}</span>
                }
                secondary={
                  <span className={classes.secondary}>
                    {drugName.description}
                  </span>
                }
              />
            </ListItem>
          </List>
          <div className="inputGroup">
            {/* Desktop layout */}
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

            {/* Mobile layout */}
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
          </div>
        </>
      )}
    </Modal>
  );
}
