import { useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

function PlanYearField({ year, state, setYear, options }) {
  const isInacctive = !state;

  useEffect(() => {
    if (options.length === 1 && !year) {
      setYear(options[0].value);
    }
  }, [options]);

  return (
    <td>
      <Box className={styles.customBodyRow}>
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
    </td>
  );
}

PlanYearField.propTypes = {};

export default PlanYearField;
