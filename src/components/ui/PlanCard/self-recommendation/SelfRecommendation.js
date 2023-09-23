import React from "react";
import styles from "./SelfRecommendation.module.scss";
import image from "./image.png";

function SelfRecommendation({ pills }) {
  return (
    <div className={styles.container}>
      <div>
        <img alt="logo" src={image} />
      </div>
      <div className={styles.content}>
        <div className={styles.heading}>
          Ask Integrity Cross-Sell Recommendations
        </div>
        <div className={styles.pills}>
          {pills?.split(", ").map((pill) => (
            <span className={styles.pill}>{pill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelfRecommendation;
