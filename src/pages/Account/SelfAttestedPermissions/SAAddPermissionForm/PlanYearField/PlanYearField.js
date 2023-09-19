import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

function PlanYearField({}) {
  return (
    <td>
      <Box className={styles.customBodyRow}>
        <Box className={styles.label}>Year</Box>
        <Select
          style={{ width: "100%" }}
          placeholder="select"
          options={[]}
          initialValue=""
          onChange={(value) => {
            console.log(value)
          }}
          showValueAlways={false}
        />
      </Box>
    </td>
  );
}

PlanYearField.propTypes = {};

export default PlanYearField;
