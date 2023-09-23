import React from "react";
import { Button } from "packages/Button";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import styles from "./styles.module.scss";

function FilterButtons({ reset, apply }) {
  return (
    <Box className={styles.filterButton}>
      <Button variant="secondary" size="medium" onClick={reset}>
        Reset
      </Button>
      <Button variant="primary" size="medium" onClick={apply}>
        Apply
      </Button>
    </Box>
  );
}

FilterButtons.propTypes = {
  reset: PropTypes.func,
  apply: PropTypes.func,
};

export default FilterButtons;
