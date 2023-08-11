import React from "react";
import styles from "./Edit.module.scss";
import EditIcon from "components/icons/edit2";

function Edit() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Edit</div>
      <EditIcon />
    </div>
  );
}

export default Edit;
