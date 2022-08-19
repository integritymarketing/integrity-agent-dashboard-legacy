import React from "react";
import styles from "./styles.module.scss";

export default function IconWithText({ text, icon }) {
  return (
    <div className={styles.layout}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.text}> {text}</div>
    </div>
  );
}
