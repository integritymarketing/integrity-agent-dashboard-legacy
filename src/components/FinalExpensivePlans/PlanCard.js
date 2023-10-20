import React from "react";
import Box from "@mui/material/Box";
import { Button } from "components/ui/Button";
import Card from "@mui/material/Card";
import InfoBlueIcon from "components/icons/info-blue";
import EnrollBack from "images/enroll-btn-back.svg";
import styles from "./PlanCard.module.scss";

const PlanCard = ({
  Company,
  Rates,
  CompensationWarning,
  PolicyFee,
  IsSocialSecurityBillingSupported,
  PlanInfo,
  UnderwritingWarning,
  planName,
}) => {
  const { LogoUri = "" } = Company;

  const monthlyPremium = Rates[0]?.MonthlyPremium;

  const coverageAmount = monthlyPremium * (12 - new Date().getMonth()); // TODO - get coverage amount has done as just assumption, we need to rewrite this logic

  // We have change the data structure of Plan card info based on the API response and requirement

  return (
    <Card className={styles.card}>
      <Box>
        <Box className={styles.planHeader}>
          <div className={styles.planName}>{planName}</div>
          <img src={LogoUri} alt={planName} className={styles.logoIMG} />
        </Box>

        <Box className={styles.costCard}>
          <Box className={styles.monthlyCostCard}>
            <div className={styles.monthlyCostLabel}>Coverage Amount</div>
            <div variant="h3" className={styles.monthlyCostValue}>
              ${coverageAmount}
            </div>
            <div className={styles.monthlyCostLabel}>Monthly Premium</div>
            <div variant="h3" className={styles.monthlyCostValue}>
              ${monthlyPremium}
              <span>/mo</span>
            </div>
          </Box>

          <Box className={styles.costDetails}>
            <Box className={styles.costRow}>
              <div className={styles.costLabel}>Policy Fee</div>
              <div className={styles.costValue}>${PolicyFee}</div>
            </Box>
            <Box className={styles.costRow}>
              <div className={styles.costLabel}>
                Social Security Billing Supported
              </div>
              <div className={styles.costValue}>
                {IsSocialSecurityBillingSupported ? "Yes" : "NO"}
              </div>
            </Box>
            <Box className={styles.costRow}>
              <div className={styles.costLabel}>Plan Info</div>
              <div className={styles.costValue}>
                {PlanInfo?.map((item) => (
                  <div className={styles.planInfoDetail}>{item}</div>
                ))}
              </div>
            </Box>
            <Box className={styles.warningContainer}>
              <div className={styles.warning}>Warnings </div>
              <div title={UnderwritingWarning} className={styles.warningIcon}>
                <InfoBlueIcon color="#4178FF" />
              </div>
            </Box>
          </Box>
        </Box>

        <Box className={styles.applyButtonContainer}>
          <Button
            label={"Apply"}
            icon={<img src={EnrollBack} alt="Apply" />}
            className={styles.applyButton}
            iconPosition={"right"}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default PlanCard;
