import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Radio from "@material-ui/core/Radio";
import ListItemText from "@material-ui/core/ListItemText";

const usePrescriptionListStyles = makeStyles((theme) => ({
  // Style rules for the radio buttons
  radio: {
    color: "#434A51",
    "&.Mui-checked": {
      color: "#4178FF",
    },
  },

  // Style rules for the list items
  listItem: {
    backgroundColor: "#dddddd !important",
    height: 56,
    boxShadow: "inset 0px -1px 0px #cccccc",
    "&.Mui-selected, &.Mui-selected:hover, &:hover": {
      backgroundColor: "#f1faff !important",
    },
  },

  // Style rules for the primary and secondary text of list items
  primaryText: {
    color: "#434A51",
    fontFamily: "Lato",
    fontSize: "16px",
    letterSpacing: "0.16px",
  },
  secondaryText: {
    color: "#717171",
    fontFamily: "Lato",
    fontSize: "14px",
  },

  // Style rules for the list Root

  listRoot: {
    "& li:first-of-type": {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    "& li:last-of-type": {
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    "&.MuiIconButton-colorSecondary:hover": {
      backgroundColor: "transparent !important",
    },
  },
}));

const PrescriptionList = ({ onDrugSelection, prescriptionList, selected }) => {
  const classes = usePrescriptionListStyles();
  const handleSelectionChange = useCallback(
    (drug) => {
      onDrugSelection(drug);
    },
    [onDrugSelection]
  );

  const renderedPrescriptionList = useMemo(
    () =>
      prescriptionList.map((drug, index) => (
        <ListItem
          key={index}
          button
          selected={selected}
          onClick={() => handleSelectionChange(drug)}
          classes={{ root: classes.listItem }}
        >
          <Radio
            disableRipple
            onClick={() => handleSelectionChange(drug)}
            checked={selected}
            classes={{ root: classes.radio }}
          />
          <ListItemText
            primary={<span className={classes.primaryText}>{drug.label}</span>}
            secondary={
              <span className={classes.secondaryText}>{drug.description}</span>
            }
          />
        </ListItem>
      )),
    [prescriptionList, selected, handleSelectionChange, classes]
  );

  return <List className={classes.listRoot}>{renderedPrescriptionList}</List>;
};

PrescriptionList.propTypes = {
  onDrugSelection: PropTypes.func.isRequired,
  prescriptionList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
};

PrescriptionList.defaultProps = {
  prescriptionList: [],
};

export default PrescriptionList;
