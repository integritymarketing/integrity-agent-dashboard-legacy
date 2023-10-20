// External Packages
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import React from "react";

// Internal Modules
import styles from "./FinalExpensesPlanHeader.module.scss";

const FinalExpensesPlanHeader = ({ logoUri, name }) => {
  return (
    <Box className={styles.planHeader}>
      <div className={styles.planName}>{name}</div>
      {logoUri && (
        <img src={logoUri} alt={name} className={styles.companyLogo} />
      )}
    </Box>
  );
};

FinalExpensesPlanHeader.propTypes = {
  logoUri: PropTypes.string, // URI for the logo image
  planName: PropTypes.string.isRequired, // Name of the plan
};

export default FinalExpensesPlanHeader;
