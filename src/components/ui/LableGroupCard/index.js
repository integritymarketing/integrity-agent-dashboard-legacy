import React from "react";
import styles from "./index.module.scss";

export default function LableGroupCard(labelNamesObj) {
const lnames = labelNamesObj['labelNames'].split(',');

  return (
      lnames.map((value) => <span key={value} className={styles.labelTagText}>{value}</span>)
  );
}
