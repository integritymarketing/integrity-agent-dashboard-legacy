import { useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

function ProductField({ product, carrier, setProduct, options }) {
  const isInacctive = !carrier;
  
  useEffect(() => {
    if(options.length === 1 && !product){
      setProduct(options[0].value)
    }
  }, [options])

  return (
    <td>
      <Box className={styles.customBodyRow}>
        <Box className={isInacctive ? styles.labelInactive : styles.label}>
          Product
        </Box>
        <Select
          style={{ width: "100%" }}
          placeholder="select"
          options={options}
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
