import React from "react";
import styles from "./Row.module.scss";
import Header from "../Header";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";
import { currencyFormatter } from "../../../cost-table";

function Row({ isMobile, drugDetails, isCovered, prescriptions }) {
  const findPrescriptionByLabelName = (labelName) => {
    return prescriptions?.find(
      (prescription) => labelName === prescription?.dosage?.labelName
    );
  };
  const getRestrictionLabel = (drugDetail) => {
    if (!drugDetail) {
      return;
    }
    const { hasQuantityLimit, hasStepTherapy, hasPriorAuthorization } =
      drugDetail;
    let value = [];
    if (!hasQuantityLimit && !hasStepTherapy && !hasPriorAuthorization) {
      return "None";
    }
    if (hasPriorAuthorization) {
      value.push("Prior Authorization");
    }
    if (hasStepTherapy) {
      value.push("Step Therapy");
    }
    if (hasQuantityLimit) {
      value.push("Quantity Limit");
    }
    return value.join(", ");
  };

  const getRestrictionData = (drugDetail) => {
    if (!drugDetail) {
      return;
    }
    const { hasQuantityLimit, quantityLimitAmount, quantityLimitDays } =
      drugDetail;
    if (hasQuantityLimit) {
      return ` - ${quantityLimitAmount} / ${quantityLimitDays} days`;
    }
  };

  const getNumberInText = (number) => {
    switch (number) {
      case 1:
        return "one month";
      case 2:
        return "two months";
      case 3:
        return "three months";
      case 4:
        return "four months";
      case 5:
        return "five months";
      case 6:
        return "six months";
      case 12:
        return "year";
      default:
        return "";
    }
  };

  const getDoseQuantity = (labelName) => {
    const prescription = findPrescriptionByLabelName(labelName);
    if (!prescription || !prescription.dosage) {
      return;
    }
    const { dosage } = prescription;
    const duration = getNumberInText(Math.floor(dosage.daysOfSupply / 30));
    if (dosage.selectedPackage) {
      return `${dosage.userQuantity} X ${dosage.selectedPackage.packageDisplayText} per ${duration}`;
    }

    return `${dosage.userQuantity} tablets per ${duration}`;
  };

  return (
    <>
      {drugDetails?.map((drugDetail, i) => {
        const restrictionValue = getRestrictionLabel(drugDetail || {});

        return (
          <div
            key={i}
            className={`${styles?.container} ${
              isMobile ? styles?.mbContainer : ""
            }`}
          >
            <div className={`${styles.left} ${isMobile ? styles?.mbLeft : ""}`}>
              <div style={{ width: "24px" }}>
                {isCovered ? <InNetworkIcon /> : <OutNetworkIcon />}
              </div>
              <div className={styles.data}>
                <div className={`${styles.secondaryColor} ${styles.type}`}>
                  {drugDetail?.tierDescription || "Non-Preferred Drug"}
                </div>
                <div className={`${styles.primaryColor} ${styles?.name}`}>
                  {drugDetail?.labelName}
                </div>
                <div className={`${styles.secondaryColor} ${styles?.dose}`}>
                  {getDoseQuantity(drugDetail?.labelName)}
                </div>
              </div>
            </div>
            <div className={styles.right}>
              {isMobile && <Header isRow={true} isMobile={true} />}
              <div className={styles.top}>
                <div className={styles.cell}>
                  {currencyFormatter.format(drugDetail?.deductible || 0)}
                </div>
                <div className={styles.cell}>
                  {currencyFormatter.format(drugDetail?.beforeGap || 0)}
                </div>
                <div className={styles.cell}>
                  {currencyFormatter.format(drugDetail?.gap || 0)}
                </div>
                <div className={styles.cell}>
                  {currencyFormatter.format(drugDetail?.afterGap || 0)}
                </div>
              </div>
              <div className={styles.bottom}>
                Restrictions:
                <span
                  className={`${
                    restrictionValue === "None" ? "" : styles.label
                  }`}
                >
                  {restrictionValue}
                </span>
                <span>{getRestrictionData(drugDetail || {})}</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Row;
