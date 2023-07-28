import React, { useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Radio from "@material-ui/core/Radio";
import ListItemText from "@material-ui/core/ListItemText";

const usePrescriptionListStyles = makeStyles((theme) => ({}));

const PrescriptionItem = ({ drug, onDrugSelection, selectedValue }) => {
  const classes = usePrescriptionListStyles();

  const handleDrugSelection = useCallback(() => {
    onDrugSelection(drug);
  }, [onDrugSelection, drug]);

  const isSelected = useMemo(() => {
    return drug.value === selectedValue;
  }, [drug.value, selectedValue]);

  return (
    <List className={classes.listRoot}>
      <ListItem
        button
        onClick={handleDrugSelection}
        selected={isSelected}
        className={classes.listItem}
      >
        <Radio
          disableRipple
          checked={isSelected}
          onClick={handleDrugSelection}
          classes={{ root: classes.radio, checked: classes.checked }}
        />
        <ListItemText
          primary={<span className={classes.primaryText}>{drug.label}</span>}
          secondary={
            <span className={classes.secondaryText}>{drug.description}</span>
          }
        />
      </ListItem>
    </List>
  );
};

PrescriptionItem.propTypes = {
  drug: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onDrugSelection: PropTypes.func.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

PrescriptionItem.defaultProps = {
  drug: {
    label: "",
    value: "",
    description: "",
  },
  onDrugSelection: () => {},
  selectedValue: "",
};

export default PrescriptionItem;
