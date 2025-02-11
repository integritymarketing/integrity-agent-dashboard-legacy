import React from "react";
import styles from "./styles.module.scss";

const Spinner = () => (
  <div className={styles.spinner}>
    <div className={styles.dot} />
  </div>
);

export default Spinner;
