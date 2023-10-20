// External Packages
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import React from "react";

// Internal Modules
import { Button } from "components/ui/Button";
import EnrollBack from "images/enroll-btn-back.svg";
import styles from "./FinalExpensesPlanCard.module.scss";
import { FinalExpensesPlanCostDetails } from "../FinalExpensesPlanCostDetails";
import { FinalExpensesPlanHeader } from "../FinalExpensesPlanHeader";

const FinalExpensesPlanCard = ({
  company,
  rates,
  policyFee,
  isSocialSecurityBillingSupported,
  planInfo,
  underwritingWarning,
}) => {
  const { LogoUri = "", Name } = company;
  return (
    <Card className={styles.finalExpensesPlanCard}>
      <Box>
        <FinalExpensesPlanHeader name={Name} logoUri={LogoUri} />
        <FinalExpensesPlanCostDetails
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

FinalExpensesPlanCard.propTypes = {
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

FinalExpensesPlanCard.defaultProps = {
  company: {
    logoUri: "",
  },
};

export default FinalExpensesPlanCard;
