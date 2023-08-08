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

function Header({ nonPrescribed, isMobile, isRow }) {
  const titles = nonPrescribed ? columnHeaderTitle2 : columnHeaderTitle;
  const rowTitles = isRow ? columnHeaderTitle.slice(1) : columnHeaderTitle;

  console.log(rowTitles);

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
