import React from "react";
import styles from "./styles.module.scss";

const SubHeaderMobile = ({ title, actionTitle, ActionIcon, callBack }) => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      {actionTitle ? (
        <div onClick={callBack} className={styles.actionTitle}>
          {actionTitle}{" "}
          <span className={styles.actionIcon}>
            <ActionIcon />
          </span>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SubHeaderMobile;
