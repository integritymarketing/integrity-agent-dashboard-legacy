import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

function PlanYearField({ year, state, setYear, options, isMobile }) {
  const isInactive = !state;

  useEffect(() => {
    if (options.length === 1 && state && !year) {
      setYear(options[0].value);
    }
  }, [options, state, year, setYear]);

  return (
    <Box className={isMobile ? styles.mobileRow : styles.customBodyRow}>
      <Box className={isInactive ? styles.labelInactive : styles.label}>
        Year
      </Box>
      <Select
        style={{ width: "100%" }}
        placeholder="Select"
        options={options}
        initialValue={year}
        onChange={setYear}
        showValueAlways={false}
        disabled={isInactive}
      />
    </Box>
  );
}

PlanYearField.propTypes = {
  year: PropTypes.number,
  state: PropTypes.string,
  setYear: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  isMobile: PropTypes.bool,
};

export default PlanYearField;
