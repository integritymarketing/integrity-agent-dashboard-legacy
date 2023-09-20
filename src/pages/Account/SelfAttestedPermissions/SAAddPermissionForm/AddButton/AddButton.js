import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import AddIcon from "components/icons/add";

import styles from "./styles.module.scss";

function AddButton({ OnAddClickHandle, isMobile }) {
  return (
    <Box className={isMobile ? styles.mobileRow : styles.customBodyRow}>
      <Grid
        display="flex"
        alignItems="center"
        onClick={OnAddClickHandle}
        className={styles.link}
        gap={1}
      >
        <Box>Add</Box>
        <AddIcon color="#ffffff" />
      </Grid>
    </Box>
  );
}

AddButton.propTypes = {
  OnAddClickHandle: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default AddButton;
