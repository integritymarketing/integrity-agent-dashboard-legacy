import React from "react";
import styles from "./header.module.scss";

const columnHeaderTitle = [
  "Covered Prescriptions",
  "Deductible",
  "Copay",
  "Gap",
  "Catastrophic",
];

const columnHeaderTitle2 = [
  "Non-covered Prescriptions",
  "Deductible",
  "Copay",
  "Gap",
  "Catastrophic",
];

function Header({ isCovered, isMobile, isRow }) {
  const titles = isCovered ? columnHeaderTitle : columnHeaderTitle2;
  const rowTitles = isRow ? titles.slice(1) : titles;

  if (isMobile && !isRow) {
    return (
      <div className={styles.mbContainer}>
        <div className={styles.title}>{titles[0]}</div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${isMobile ? styles.mbContainer : ""}`}
    >
      {rowTitles.map((title) => {
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
  );
}

export default Header;
