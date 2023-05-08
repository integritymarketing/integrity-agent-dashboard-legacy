import React from "react";
import styles from "./styles.module.scss";

const mockData = [
  {
    status: "Started",
    bgColor: "#deebfb",
    count: "4",
  },
  {
    status: "Applied",
    bgColor: "#fcf6b0",
    count: "8",
  },
  {
    status: "Issued",
    bgColor: "#defbe6",
    count: "34",
  },
  {
    status: "Declined",
    bgColor: "#fbdede",
    count: "74",
  },
];

export default function PolicyCounterCards() {
  return (
    <div className={styles.countCardsContainer}>
      {mockData?.map((card) => {
        return (
          <div className={styles.counterCard}>
            <div className={styles.countName}>{card.status}</div>
            <div className={styles.countInfo}>
              <div
                className={`${styles.countColour} `}
                style={{ backgroundColor: card.bgColor }}
              ></div>
              <div className={styles.count}>{card.count}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
