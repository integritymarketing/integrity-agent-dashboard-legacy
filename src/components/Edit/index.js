import React from "react";
import styles from "./Edit.module.scss";
import EditIcon from "components/icons/edit2";

function Edit({ onClick, label = "Edit" }) {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.title}>{label}</div>
      <EditIcon />
    </div>
  );
}

export default Edit;
