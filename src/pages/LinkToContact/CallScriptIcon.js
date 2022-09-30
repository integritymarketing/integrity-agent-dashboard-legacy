import React from "react";
import styles from "./styles.module.scss";
import callIcon from "images/icon-Script.svg";

export default function CallScriptIcon() {
  return (
    <img src={callIcon} alt={"callIcon"} className={styles.callScript} />
  );
}
