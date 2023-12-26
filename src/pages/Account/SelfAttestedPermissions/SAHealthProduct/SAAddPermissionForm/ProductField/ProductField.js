import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Select } from "components/ui/Select";
import styles from "./styles.module.scss";

function ProductField({ product, carrier, setProduct, options, isMobile }) {
  const isInactive = !carrier;

  useEffect(() => {
    if (options.length === 1 && !product) {
      setProduct(options[0].value);
    }
  }, [options, product, setProduct]);

  return (
    <Box className={isMobile ? styles.mobileRow : styles.customBodyRow}>
      <Box className={isInactive ? styles.labelInactive : styles.label}>
        Product
      </Box>
      <Select
        style={{ width: "100%" }}
        placeholder="Select"
        options={options}
        onChange={setProduct}
        initialValue={product}
        showValueAlways={false}
        disabled={isInactive}
      />
    </Box>
  );
}

ProductField.propTypes = {
  product: PropTypes.string,
  carrier: PropTypes.string,
  setProduct: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  isMobile: PropTypes.bool,
};

export default ProductField;
