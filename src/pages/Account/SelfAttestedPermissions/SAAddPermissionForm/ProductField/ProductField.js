import { useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { Select } from "components/ui/Select";

import styles from "./styles.module.scss";

function ProductField({ product, carrier, setProduct, options, isMobile }) {
  const isInacctive = !carrier;

  useEffect(() => {
    if (options.length === 1 && !product) {
      setProduct(options[0].value);
    }
  }, [options]);

  return (
    <Box className={isMobile ? styles.mobileRow : styles.customBodyRow}>
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
  );
}

ProductField.propTypes = {
  product: PropTypes.string,
  carrier: PropTypes.string,
  setProduct: PropTypes.func,
  options: PropTypes.array,
  isMobile: PropTypes.bool,
};

export default ProductField;
