import React from "react";
import styles from "./styles.module.scss";

const AccountMobile = ({ data }) => {
  const { firstName, lastName, phone, npn, email } = data;
  return (
    <div className={styles.details}>
      <div className={styles.content}>
        <div className={styles.title}>Full Name</div>
        <div className={styles.name}>{`${firstName} ${lastName}`}</div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>National Producer Number</div>
        <div className={styles.npn}>{npn}</div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>Email</div>
        <div className={styles.email}>{email}</div>
      </div>

      <div className={styles.content} style={{ border: "none" }}>
        <div className={styles.title}>Phone</div>
        <div className={styles.phone}>{phone}</div>
      </div>
    </div>
  );
};

export default AccountMobile;
