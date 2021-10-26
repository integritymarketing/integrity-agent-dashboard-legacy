import React from "react";

import styles from "./PlansPage.module.scss";
import { Button } from "components/ui/Button";
import Close from "../components/icons/input-clear";

/**
 * Primary UI component for user interaction
 */
export const PlanPageFooter = ({ plans = [], onRemove }) => {
  if (!plans || plans.length < 1) {
    return null;
  }
  const planCopy = [...plans];
  for (let i = plans.length; i < 3; i++) {
    planCopy.push(null);
  }
  const LOGO_BASE_URL =
    "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/";

  return (
    <div className={styles["plan-footer"]} data-gtm="plans-compare-wrapper">
      {planCopy.map((plan) => {
        console.log("plan", plan);

        if (!plan) {
          return (
            <div
              className={`${styles["plans-list"]} ${styles["empty-plan"]}`}
            ></div>
          );
        } else
          return (
            <div className={styles["plans-list"]} data-gtm="plan-comparision">
              <div className={styles["close"]} onClick={() => onRemove(plan)}>
                {" "}
                <Close />
              </div>

              <div>
                {" "}
                <img src={LOGO_BASE_URL + plan.logoURL} alt="logo" />
              </div>

              <div className={styles["plan-name"]}>{plan.planName}</div>
            </div>
          );
      })}
      <Button
        label="Compare"
        type="primary"
        disabled={plans.length < 2}
        data-gtm="button-compare"
      />
    </div>
  );
};
