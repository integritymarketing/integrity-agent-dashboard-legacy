// External Packages
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import React from "react";

// Internal Modules
import { Button } from "components/ui/Button";
import EnrollBack from "images/enroll-btn-back.svg";
import styles from "./FinalExpensePlanCard.module.scss";
import { FinalExpensePlanCostDetails } from "../FinalExpensePlanCostDetails";
import { FinalExpensePlanHeader } from "../FinalExpensePlanHeader";

const FinalExpensePlanCard = ({
  company,
  rates,
  policyFee,
  isSocialSecurityBillingSupported,
  planInfo,
  underwritingWarning,
}) => {
  const { LogoUri = "", Name } = company;
  return (
    <Card className={styles.finalExpensePlanCard}>
      <Box>
        <FinalExpensePlanHeader name={Name} logoUri={LogoUri} />
        <FinalExpensePlanCostDetails
          rates={rates}
          policyFee={policyFee}
          isSocialSecurityBillingSupported={isSocialSecurityBillingSupported}
          planInfo={planInfo}
          underwritingWarning={underwritingWarning}
        />
        <Box className={styles.applyButtonContainer}>
          <Button
            label="Apply"
            icon={<img src={EnrollBack} alt="Apply" />}
            className={styles.applyButton}
            iconPosition="right"
          />
        </Box>
      </Box>
    </Card>
  );
};

FinalExpensePlanCard.propTypes = {
  company: PropTypes.shape({
    logoUri: PropTypes.string, // URI for the company logo
  }),
  rates: PropTypes.array, // Array containing the rate details
  policyFee: PropTypes.number, // The fee associated with the policy
  isSocialSecurityBillingSupported: PropTypes.bool, // Indicates if social security billing is supported
  planInfo: PropTypes.object, // Contains the plan details
  underwritingWarning: PropTypes.string, // Warning or notice related to underwriting
  planName: PropTypes.string, // The name of the plan
};

FinalExpensePlanCard.defaultProps = {
  company: {
    logoUri: "",
  },
};

export default FinalExpensePlanCard;
