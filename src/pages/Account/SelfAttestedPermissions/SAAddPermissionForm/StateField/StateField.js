import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Select } from "components/ui/Select";
import { STATES_OPTIONS } from "../../../../../constants";
import styles from "./styles.module.scss";

function StateField({ state, product, setState, isMobile }) {
  const isInactive = !product;

  return (
    <Box className={isMobile ? styles.mobileRow : styles.customBodyRow}>
      <Box className={isInactive ? styles.labelInactive : styles.label}>
        State
      </Box>
      <Select
        style={{ width: "100%" }}
        placeholder="Select"
        options={STATES_OPTIONS}
        initialValue={state}
        onChange={setState}
        showValueAlways={false}
        disabled={isInactive}
      />
    </Box>
  );
}

StateField.propTypes = {
  state: PropTypes.string,
  product: PropTypes.string,
  setState: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default StateField;
