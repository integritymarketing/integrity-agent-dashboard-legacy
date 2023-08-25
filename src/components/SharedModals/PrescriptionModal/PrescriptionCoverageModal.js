import React from "react";
import ArrowForwardWithCircle from "../Icons/ArrowForwardWithCirlce";
import AddCircleOutline from "../Icons/AddCircleOutline";
import Typography from "@mui/material/Typography";
import Modal from "components/Modal";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import makeStyles from "@mui/styles/makeStyles";
import FREQUENCY_OPTIONS from "utils/frequencyOptions";
import "./style.scss";

const useStyles = makeStyles((theme) => ({
  listRoot: {
    "& li:first-of-type": {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    "& li:last-of-type": {
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    height: 72,
    boxShadow: "inset 0px -1px 0px #DDDDDD;",
  },
  drugType: {
    color: "#717171",
    fontSize: 14,
    fontFamily: "Lato",
    letterSpacing: "0.24px",
  },
  planName: {
    color: "#052A63",
    fontSize: 24,
    fontFamily: "Lato",
    letterSpacing: "0.24px",
    marginTop: 20,
  },
  labelName: {
    color: "#052A63",
    fontSize: 14,
    fontFamily: "Lato",
    letterSpacing: "0.24px",
  },
  packDetails: {
    color: "#717171",
    fontSize: 14,
    fontFamily: "Lato",
    letterSpacing: "0.24px",
  },
}));

const getFrequencyValue = (dayofSupply) => {
  const frequencyOptions = FREQUENCY_OPTIONS.filter(
    (option) => option.value === dayofSupply
  );
  const result = frequencyOptions[0]?.label;
  return result;
};

const PrescriptionRow = ({ item }) => {
  const classes = useStyles();

  const { dosage, dosageDetails } = item;
  const { labelName, daysOfSupply, drugType, selectedPackage, userQuantity } =
    dosage;
  const selectPackageDetails = selectedPackage
    ? `${userQuantity} X ${
        selectedPackage.packageDisplayText
      } ${getFrequencyValue(daysOfSupply)}`
    : dosageDetails
    ? `${userQuantity} ${dosageDetails.dosageFormName.toLowerCase()} ${getFrequencyValue(
        daysOfSupply
      )}`
    : "";

  return (
    <ListItem className={classes.listItem}>
      <ListItemText
        primary={drugType}
        secondary={
          <>
            <Typography
              component="span"
              variant="body2"
              className={classes.labelName}
            >
              {labelName}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              className={classes.packDetails}
            >
              {selectPackageDetails}
            </Typography>
          </>
        }
        classes={{
          primary: classes.drugType,
          secondary: "prescription-coverage-modal__row__secondary",
        }}
      />
    </ListItem>
  );
};

const PrescriptionCoverageModal = ({
  prescriptions,
  onClose,
  open,
  planName,
}) => {
  const classes = useStyles();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={"Prescription Coverage"}
      customFooter={<div> + ADD NEW </div>}
      hideFooter={true}
    >
      <>
        <Typography className={classes.planName}>{planName}</Typography>
        <List className={classes.listRoot}>
          {prescriptions.map((item, index) => (
            <PrescriptionRow key={index} item={item} />
          ))}
        </List>
      </>
    </Modal>
  );
};
export default PrescriptionCoverageModal;
