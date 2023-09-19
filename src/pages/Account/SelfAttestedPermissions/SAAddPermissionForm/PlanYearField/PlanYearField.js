import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

function PlanYearField({ year, state, setYear }) {
  const isInacctive = !state;

  return (
    <td>
      <Box className={styles.customBodyRow}>
        <Box className={isInacctive ? styles.labelInactive : styles.label}>
          Year
        </Box>
        <Select
          style={{ width: "100%" }}
          placeholder="select"
          options={[{ label: 2023, value: 2023 }]}
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
