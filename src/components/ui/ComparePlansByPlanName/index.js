import React from "react";
import { Button } from "components/ui/Button";
import styles from "../../../pages/PlansPage.module.scss";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const LOGO_BASE_URL =
  "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/";

export default function ComparePlansByPlaneName({
  comparePlans,
  setComparePlanModalOpen,
  handleRemovePlan,
  id,
  plansLoading,
  isEmail = false,
  isModal = false,
}) {
  return (
    <div
      className={`${styles["plan-comparsion-heder"]} ${
        plansLoading && styles["display-initial"]
      } container ${isModal && styles["in-modal"]}`}
    >
      {comparePlans.length > 0 && (
        <>
          {!isModal && !isEmail && (
            <div className={`${styles["compare-div"]}`}>
              <div className={`${styles["vertical-stack"]}`}>
                <div className={`${styles["compare-text"]}`}>Compare Plans</div>
                <div className={`${styles["spacer"]}`}></div>
                <div className={`${styles["share-plan-text"]}`}>
                  Share plans with client
                </div>
                <Button
                  onClick={() => setComparePlanModalOpen(true)}
                  label="Share"
                  type="secondary"
                ></Button>
              </div>
              <span className={`${styles["plan-separator"]}`}></span>
            </div>
          )}
          {isEmail && (
            <div className={`${styles["compare-div"]}`}>
              <div className={`${styles["compare-text"]}`}>Compare Plans</div>
              <div className={`${styles["spacer"]}`}></div>
            </div>
          )}
          {comparePlans?.map((plan, idx) => (
            <div key={idx} className={`${styles["plan-div"]}`}>
              <div
                className={`${styles["comp-mr-left"]} ${styles["compr-plan-col-hdr"]}`}
              >
                <div>
                  {" "}
                  <img
                    src={LOGO_BASE_URL + plan.logoURL}
                    alt="logo"
                    className={styles["plan-img"]}
                  />
                </div>
                <div className={styles["comp-plan-name"]}>
                  {plan && plan.planName}
                </div>
                <div className={styles["comp-plan-amnt"]}>
                  <span className={styles["value"]}>
                    {currencyFormatter.format(plan.annualPlanPremium / 12)}
                    <span className={styles["per"]}> / month</span>
                  </span>
                </div>
                {!isModal && <Button label="Enroll" type="primary" />}
                {!isModal && !isEmail && comparePlans.length > 1 && (
                  <span
                    className={styles.close}
                    onClick={() => handleRemovePlan(plan.id)}
                  >
                    X
                  </span>
                )}
              </div>
              <div className={`${styles["plan-seperator"]}`}></div>
            </div>
          ))}
          {!isEmail && comparePlans.length < 3 && (
            <div className={`${styles["plan-div"]}`}>
              <span className={styles["retrun-txt"]}>
                <a href={`/plans/${id}?preserveSelected=true`}>
                  Return to plans list to add{" "}
                  {comparePlans.length === 1 ? "2nd" : "3rd"} plan for
                  Comparison.
                </a>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
