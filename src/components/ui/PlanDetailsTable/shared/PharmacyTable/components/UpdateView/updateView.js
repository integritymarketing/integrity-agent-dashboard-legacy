import React from "react";
import styles from "./updateView.module.scss";

function UpdateView({ data }) {
  if (!data) return null;

  const address = [
    data.address1,
    data.address2,
    data.city,
    data.state,
    data.zip,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Current Pharmacy</div>
      <div className={styles.content}>
        <div className={styles.name}>{data?.name}</div>
        <div className={styles.address}>{address}</div>
      </div>
    </div>
  );
}

export default UpdateView;
