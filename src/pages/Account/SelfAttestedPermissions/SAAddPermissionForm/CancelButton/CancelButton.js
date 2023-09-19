import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import styles from "./styles.module.scss";

function CancelButton({ OnCancelClickHandle }) {
  return (
    <td>
      <Box className={styles.customBodyRow}>
        <Box className={styles.link} onClick={OnCancelClickHandle}>Cancel</Box>
      </Box>
    </td>
  );
}

CancelButton.propTypes = {
  OnCancelClickHandle: PropTypes.func
};

export default CancelButton;
