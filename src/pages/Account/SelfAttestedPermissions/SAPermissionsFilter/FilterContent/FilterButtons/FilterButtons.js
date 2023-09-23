import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import styles from "./styles.module.scss";

function FilterButtons({ reset, apply }) {
  return (
    <Box className={styles.filterButton}>
      <button className={styles.resetButton} onClick={reset}>
        Reset
      </button>
      <button className={styles.applyButton} onClick={apply}>
        Apply
      </button>
    </Box>
  );
}

FilterButtons.propTypes = {
  reset: PropTypes.func,
  apply: PropTypes.func,
};

export default FilterButtons;
