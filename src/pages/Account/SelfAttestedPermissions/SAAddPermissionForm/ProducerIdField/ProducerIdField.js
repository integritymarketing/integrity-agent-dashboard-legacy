import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Textfield from "components/ui/textfield";

import styles from "./styles.module.scss";

function ProducerIdField({ producerId = '' }) {
  return (
    <td>
      <Box className={styles.customBodyRow}>
        <Box className={styles.label}>Producer ID</Box>
        <Textfield
          className={styles.customTextField}
          value={producerId}
          readOnly
        />
      </Box>
    </td>
  );
}

ProducerIdField.propTypes = {};

export default ProducerIdField;
