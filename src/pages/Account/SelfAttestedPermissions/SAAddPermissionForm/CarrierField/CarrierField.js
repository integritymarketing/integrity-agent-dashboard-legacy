import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

function CarrierField({ carrier, setCarrier }) {
  return (
    <td>
      <Box className={styles.customBodyRow}>
        <Box className={styles.label}>Carrier</Box>
        <Select
          style={{ width: "100%" }}
          placeholder="select"
          options={[
            { value: 30, label: "per month" },
            { value: 60, label: "per two months" },
            { value: 90, label: "per three months" },
            { value: 180, label: "per six months"},
            { value: 365, label: "per year" },
          ]}
          initialValue={carrier}
          onChange={setCarrier}
          showValueAlways={false}
        />
      </Box>
    </td>
  );
}

CarrierField.propTypes = {};

export default CarrierField;
