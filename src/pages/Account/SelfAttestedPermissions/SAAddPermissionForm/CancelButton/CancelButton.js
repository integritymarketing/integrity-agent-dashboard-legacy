import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import styles from "./styles.module.scss";

function CancelButton({ OnCancelClickHandle, isMobile }) {
  return (
    <Box className={isMobile ? styles.mobileRow : styles.customBodyRow}>
      <Box className={styles.link} onClick={OnCancelClickHandle}>
        Cancel
      </Box>
    </Box>
  );
}

CancelButton.propTypes = {
  OnCancelClickHandle: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default CancelButton;
