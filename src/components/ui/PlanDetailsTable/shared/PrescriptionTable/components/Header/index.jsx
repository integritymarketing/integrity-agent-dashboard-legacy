import React from "react";
import styles from "./header.module.scss";

const commonColumns = ["Retail", "Copay", "Gap", "Catastrophic"];

function Header({ isCovered, isMobile, isRow }) {
  const title = isCovered
    ? "Covered Prescriptions"
    : "Non-covered Prescriptions";

  if (isMobile && !isRow) {
    return (
      <div className={styles.mbContainer}>
        <div className={styles.title}>{title}</div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${isMobile ? styles.mbContainer : ""}`}
    >
      {!isMobile && (
        <div className={`${styles.heading} ${isRow ? styles.mbTitle : ""}`}>
          {title}
        </div>
      )}
      <div className={styles.columns}>
        {commonColumns.map((title) => {
          return (
            <div
              key={title}
              className={`${styles.title} ${isRow ? styles.mbTitle : ""}`}
            >
              {title}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Header;
