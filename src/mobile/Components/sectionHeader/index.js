import React from "react";
import styles from "./styles.module.scss";

const SectionHeaderMobile = ({
  title,
  actionTitle,
  ActionIcon,
  callBack,
  showLeft = false,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      {actionTitle && ActionIcon && showLeft ? (
        <div onClick={callBack} className={styles.action}>
          <div className={styles.actionTitle}>{actionTitle}</div>
          <div className={styles.actionIcon}>{ActionIcon}</div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SectionHeaderMobile;
