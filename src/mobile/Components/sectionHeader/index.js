import React from "react";
import Arrow from "components/icons/down";
import styles from "./styles.module.scss";

const SectionHeaderMobile = ({
  title,
  actionTitle,
  ActionIcon,
  callBack,
  showLeft = false,
  isCollapse,
  setIsCollapse,
  collapseContent = false,
  className = "",
}) => {
  return (
    <div className={styles.header}>
      <div
        className={`${styles.iconWithText} ${
          className ? styles.shiftRight : ""
        }`}
      >
        {collapseContent && (
          <div
            className={`${styles.arrowIcon} ${
              isCollapse ? styles.iconReverse : ""
            }`}
            onClick={() => setIsCollapse()}
          >
            <Arrow color={"#0052CE"} />
          </div>
        )}
        <div className={styles.title}>{title}</div>
      </div>
      {actionTitle && showLeft ? (
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
