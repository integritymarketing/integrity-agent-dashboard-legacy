import { useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

function PlanYearField({ year, state, setYear, options, isMobile }) {
  const isInacctive = !state;

  useEffect(() => {
    if (options.length === 1 && !year) {
      setYear(options[0].value);
    }
  }, [options]);

  return (
    <Box className={isMobile ? styles.mobileRow : styles.customBodyRow}>
      <Box className={isInacctive ? styles.labelInactive : styles.label}>
        Year
      </Box>
      <Select
        style={{ width: "100%" }}
        placeholder="select"
        options={options}
        initialValue={year}
        onChange={setYear}
        showValueAlways={false}
        disabled={isInacctive}
      />
    </Box>
  );
}

PlanYearField.propTypes = {
  year: PropTypes.string,
  state: PropTypes.string,
  setYear: PropTypes.func,
  options: PropTypes.array,
  isMobile: PropTypes.bool,
};

export default PlanYearField;
