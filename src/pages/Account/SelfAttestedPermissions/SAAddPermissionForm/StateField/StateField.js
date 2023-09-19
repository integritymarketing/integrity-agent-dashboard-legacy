import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

const OPTIONS = [
  { label: "AL", value: "AL" },
  { label: "AK", value: "AK" },
  { label: "AZ", value: "AZ" },
  { label: "AR", value: "AR" },
  { label: "CA", value: "CA" },
  { label: "CO", value: "CO" },
  { label: "CT", value: "CT" },
  { label: "DE", value: "DE" },
  { label: "FL", value: "FL" },
  { label: "GA", value: "GA" },
  { label: "HI", value: "HI" },
  { label: "ID", value: "ID" },
  { label: "IL", value: "IL" },
  { label: "IN", value: "IN" },
  { label: "IA", value: "IA" },
  { label: "KS", value: "KS" },
  { label: "KY", value: "KY" },
  { label: "LA", value: "LA" },
  { label: "ME", value: "ME" },
  { label: "MD", value: "MD" },
  { label: "MA", value: "MA" },
  { label: "MI", value: "MI" },
  { label: "MN", value: "MN" },
  { label: "MS", value: "MS" },
  { label: "MO", value: "MO" },
  { label: "MT", value: "MT" },
  { label: "NE", value: "NE" },
  { label: "NV", value: "NV" },
  { label: "NH", value: "NH" },
  { label: "NJ", value: "NJ" },
  { label: "NM", value: "NM" },
  { label: "NY", value: "NY" },
  { label: "NC", value: "NC" },
  { label: "ND", value: "ND" },
  { label: "OH", value: "OH" },
  { label: "OK", value: "OK" },
  { label: "OR", value: "OR" },
  { label: "PA", value: "PA" },
  { label: "RI", value: "RI" },
  { label: "SC", value: "SC" },
  { label: "SD", value: "SD" },
  { label: "TN", value: "TN" },
  { label: "TX", value: "TX" },
  { label: "UT", value: "UT" },
  { label: "VT", value: "VT" },
  { label: "VA", value: "VA" },
  { label: "WA", value: "WA" },
  { label: "WV", value: "WV" },
  { label: "WI", value: "WI" },
  { label: "WY", value: "WY" },
];

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
          options={OPTIONS}
          initialValue={state}
          onChange={setState}
          showValueAlways={false}
          disabled={isInacctive}
        />
      </Box>
    </td>
  );
}

StateField.propTypes = {};

export default StateField;
