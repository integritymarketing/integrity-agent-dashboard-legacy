import React from "react";
import styles from "./Row.module.scss";
import Header from "../Header";
import InNetworkIcon from "components/icons/inNetwork";
import OutNetworkIcon from "components/icons/outNetwork";

function Row({ isMobile, drugDetails, isCovered, prescriptions }) {
  const {
    hasQuantityLimit,
    hasStepTherapy,
    hasPriorAuthorization,
    quantityLimitAmount,
    quantityLimitDays,
  } = drugDetails || {};

  const getRestrictionLabel = () => {
    if (hasQuantityLimit) {
      return "Quantity Limit";
    }
    if (hasStepTherapy) {
      return "Step Therapy";
    }
    if (hasPriorAuthorization) {
      return "Prior Authorization";
    }
    return "None";
  };

  const getRestrictionData = () => {
    if (hasQuantityLimit || hasStepTherapy || hasPriorAuthorization) {
      return `${quantityLimitAmount} \ ${quantityLimitDays}`;
    }
  };

  const restrictionValue = getRestrictionLabel();

  const getNumberInText = (number) => {
    switch (number) {
      case 1:
        return "one";
      case 2:
        return "two";
      case 3:
        return "three";
      case 4:
        return "four";
      case 5:
        return "five";
      case 6:
        return "six";
      default:
        return "";
    }
  };

  const getDoseQuantity = (labelName) => {
    const { dosage } = prescriptions?.find(
      (prescription) => labelName === prescription?.dosage?.labelName
    );
    if (dosage) {
      if (dosage?.selectedPackage) {
        return `${dosage?.userQuantity} X ${dosage?.selectedPackage?.packageDisplayText} per month`;
      }
      return `${dosage?.userQuantity} tablets per ${getNumberInText(
        Math?.floor(dosage?.daysOfSupply / 30)
      )} month`;
    }
  };

  return (
    <>
      {drugDetails?.map((drugDetails, i) => {
        return (
          <div
            key={i}
            className={`${styles?.container} ${
              isMobile ? styles?.mbContainer : ""
            }`}
          >
            <div
              className={`${styles?.left} ${isMobile ? styles?.mbLeft : ""}`}
            >
              <div style={{ width: "24px" }}>
                {isCovered ? <InNetworkIcon /> : <OutNetworkIcon />}
              </div>
              <div className={styles?.data}>
                <div className={`${styles?.secondaryColor} ${styles?.type}`}>
                  {drugDetails?.tierDescription || "Non-Preferred Drug"}
                </div>
                <div className={`${styles?.primaryColor} ${styles?.name}`}>
                  {drugDetails?.labelName}
                </div>
                <div className={`${styles?.secondaryColor} ${styles?.dose}`}>
                  {getDoseQuantity(drugDetails?.labelName)}
                </div>
              </div>
            </div>
            <div className={styles.right}>
              {isMobile && <Header isRow={true} isMobile={true} />}
              <div className={styles.top}>
                <div className={styles.cell}>
                  ${drugDetails?.deductible || "0.00"}
                </div>
                <div className={styles.cell}>
                  ${drugDetails?.beforeGap || "0.00"}
                </div>
                <div className={styles.cell}>${drugDetails?.gap || "0.00"}</div>
                <div className={styles.cell}>
                  ${drugDetails?.afterGap || "0.00"}
                </div>
              </div>
              <div className={styles.bottom}>
                Restrictions:
                <span
                  className={`${
                    restrictionValue === "None" ? "" : styles.label
                  }`}
                >
                  {getRestrictionLabel()}
                </span>
                <span>{getRestrictionData()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Row;
