import React from "react";
import styles from "./styles.module.scss";

function SplitContainer({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default SplitContainer;
