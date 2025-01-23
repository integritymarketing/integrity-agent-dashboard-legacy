import React from "react";
import styles from "./styles.module.scss";

export default function IconWithText({ text, icon, screensize = "large" }) {
  return (
    <div className={styles.layout}>
      {screensize === "small" ? (
        <div className={styles.icon}>{icon}</div>
      ) : (
        <>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.text}> {text}</div>
        </>
      )}
    </div>
  );
}
