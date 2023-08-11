import React from "react";
import styles from "./Footer.module.scss";
import { TotalEstValue } from "../../../cost-table";
import { useParams } from "react-router-dom";

function Footer({ isMobile, planData, count }) {
  const { effectiveDate } = useParams();
  const [y, m] = effectiveDate?.split("-") || [0, 0];
  const effectiveStartDate = new Date(`${y}-${m}-15`);

  return (
    <div
      className={`${styles.container} ${
        isMobile ? styles.mobileContainer : ""
      }`}
    >
      <div className={`${styles.left} ${isMobile ? styles.mbLeft : ""}`}>
        <div className={`${styles.title} ${isMobile ? styles.mbTitle : ""}`}>
          Estimated Drug Cost
        </div>
        <div
          className={`${styles.subTitle} ${isMobile ? styles.mbSubTitle : ""}`}
        >
          Based on {count} drugs
        </div>
      </div>
      <div className={`${styles.right} ${isMobile ? styles.mbRight : ""}`}>
        <TotalEstValue
          planData={planData}
          effectiveStartDate={effectiveStartDate}
          monthNumber={parseInt(m)}
        />
      </div>
    </div>
  );
}

export default Footer;
