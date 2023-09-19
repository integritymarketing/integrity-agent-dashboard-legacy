import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

function ProductField({ product, carrier, setProduct }) {
  const isInacctive = !carrier;
  console.log('product', product)
  return (
    <td>
      <Box className={styles.customBodyRow}>
        <Box className={isInacctive ? styles.labelInactive : styles.label}>
          Product
        </Box>
        <Select
          style={{ width: "100%" }}
          placeholder="select"
          options={[
            { value: "MA", label: "MA" },
            { value: "BA", label: "BA" },
            { value: "MC", label: "MC" },
            { value: "FF", label: "FF" },
          ]}
          onChange={setProduct}
          initialValue={product}
          showValueAlways={false}
          disabled={isInacctive}
        />
      </Box>
    </td>
  );
}

ProductField.propTypes = {};

export default ProductField;
