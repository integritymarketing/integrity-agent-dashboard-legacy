import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Select } from "components/ui/Select";
import styles from "./styles.module.scss";

function CarrierField({ carrier, setCarrier, options, isMobile }) {
  const shouldShowDefault = options.length === 1 && !carrier;
  const value = shouldShowDefault ? options[0].value : carrier;

  useEffect(() => {
    if (shouldShowDefault) {
      setCarrier(options[0].value);
    }
  }, [options, setCarrier, shouldShowDefault]);

  return (
    <Box className={isMobile ? styles.mobileRow : styles.customBodyRow}>
      <Box className={styles.label}>Carrier</Box>
      <Select
        style={{ width: "100%" }}
        placeholder="Select"
        options={options}
        initialValue={value}
        onChange={setCarrier}
        showValueAlways={false}
      />
    </Box>
  );
}

CarrierField.propTypes = {
  carrier: PropTypes.string,
  setCarrier: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  isMobile: PropTypes.bool,
};

export default CarrierField;
