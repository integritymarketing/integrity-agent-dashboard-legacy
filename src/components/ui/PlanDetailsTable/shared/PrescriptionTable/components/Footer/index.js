import React from "react";
import styles from "./Footer.module.scss";

function Footer({ isMobile }) {
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
          Based on 4 drugs
        </div>
      </div>
      <div className={`${styles.right} ${isMobile ? styles.mbRight : ""}`}>
        <div className={`${styles.title} ${isMobile ? styles.mbTitle : ""}`}>
          $1370
        </div>
        <div
          className={`${styles.subTitle} ${isMobile ? styles.mbSubTitle : ""}`}
        >
          Aug-dec
        </div>
      </div>
    </div>
  );
}

export default Footer;
