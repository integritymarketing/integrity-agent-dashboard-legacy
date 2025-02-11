import React from "react";
import styles from "./styles.module.scss";
export default function WidgetCard({
  status,
  bgColor,
  count,
  handleClick,
  selected,
}) {
  return (
    <div className={styles.counterCard} onClick={() => handleClick(status)}>
      <div className={styles.countName}>{status}</div>
      <div
        className={`${styles.countInfo} ${
          status === "Reminders" ? styles.mt_30 : ""
        } ${selected ? styles.selected : ""}`}
      >
        <div
          className={`${styles.countColour} `}
          style={{ backgroundColor: bgColor }}
        ></div>
        <div className={styles.count}>{count}</div>
      </div>
    </div>
  );
}
