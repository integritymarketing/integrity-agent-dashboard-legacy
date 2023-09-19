import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

function ProductField({}) {
  return (
    <td>
      <Box className={styles.customBodyRow}>
        <Box className={styles.label}>Product</Box>
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

ProductField.propTypes = {};

export default ProductField;
