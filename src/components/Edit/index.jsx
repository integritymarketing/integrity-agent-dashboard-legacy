import React from "react";
import styles from "./Edit.module.scss";

function Edit({ onClick, label = "Edit", icon }) {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.title}>{label}</div>
      {icon}
    </div>
  );
}

export default Edit;
