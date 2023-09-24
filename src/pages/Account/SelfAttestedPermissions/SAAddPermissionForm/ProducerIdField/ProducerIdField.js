import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Textfield from "components/ui/textfield";

import styles from "./styles.module.scss";

function ProducerIdField({ producerId, isMobile }) {
  return (
    <Box className={isMobile ? styles.mobileRow : styles.customBodyRow}>
      <Box className={styles.label}>Producer ID</Box>
      <Textfield
        className={isMobile ? styles.mobileField : styles.customTextField}
        value={producerId}
        readOnly
      />
    </Box>
  );
}

ProducerIdField.propTypes = {
  producerId: PropTypes.string,
  isMobile: PropTypes.bool,
};

export default ProducerIdField;
