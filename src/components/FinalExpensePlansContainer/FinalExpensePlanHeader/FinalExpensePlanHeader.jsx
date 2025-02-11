// External Packages
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import React from "react";

// Internal Modules
import styles from "./FinalExpensePlanHeader.module.scss";

const FinalExpensePlanHeader = ({ logoUri, name }) => {
  return (
    <Box className={styles.planHeader}>
      <div className={styles.planName}>{name}</div>
      {logoUri && (
        <img src={logoUri} alt={name} className={styles.companyLogo} />
      )}
    </Box>
  );
};

FinalExpensePlanHeader.propTypes = {
  logoUri: PropTypes.string, // URI for the logo image
  planName: PropTypes.string.isRequired, // Name of the plan
};

export default FinalExpensePlanHeader;
