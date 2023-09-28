import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import AddIcon from "components/icons/add";

import styles from "./styles.module.scss";

function AddButton({ OnAddClickHandle, year, isMobile }) {
  const isInacctive = !year;

  return (
    <Box className={isMobile ? styles.mobileRow : styles.customBodyRow}>
      <Box
        onClick={OnAddClickHandle}
        className={`${styles.link} ${isInacctive && styles.inactiveLink}`}
      >
        <Box>Add</Box>
        <AddIcon color="#ffffff" />
      </Box>
    </Box>
  );
}

AddButton.propTypes = {
  year: PropTypes.string,
  OnAddClickHandle: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default AddButton;
