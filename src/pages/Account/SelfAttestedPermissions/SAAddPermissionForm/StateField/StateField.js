import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";
import { STATES_OPTIONS } from "../../../../../constants";

import styles from "./styles.module.scss";

function StateField({ state, product, setState }) {
  const isInacctive = !product;

  return (
    <td>
      <Box className={styles.customBodyRow}>
        <Box className={isInacctive ? styles.labelInactive : styles.label}>
          State
        </Box>
        <Select
          style={{ width: "100%" }}
          placeholder="select"
          options={STATES_OPTIONS}
          initialValue={state}
          onChange={setState}
          showValueAlways={false}
          disabled={isInacctive}
        />
      </Box>
    </td>
  );
}

StateField.propTypes = {
  state: PropTypes.string,
  product: PropTypes.string,
  setState: PropTypes.func,
};

export default StateField;
