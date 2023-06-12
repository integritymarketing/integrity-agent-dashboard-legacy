import React from "react";
import usePreferences from "hooks/usePreferences";
import styles from "./styles.module.scss";

const TabsCard = ({ tabs, preferencesKey, statusIndex, setStatusIndex }) => {
  const [, setValue] = usePreferences(0, preferencesKey);

  const onTabClick = (index) => {
    setStatusIndex(index);
    setValue(index, preferencesKey);
  };

  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab, i) => {
        const { policyCount, colorCode, policyStatus } = tab;
        return (
          <div className={styles.tab} key={policyStatus + i}>
            <span className={styles.tabHeading}>{policyStatus}</span>
            <div
              onClick={() => onTabClick(i, tab)}
              className={`${styles.tabContent} ${
                i === statusIndex ? styles.selected : ""
              } `}
            >
              <span
                style={{ backgroundColor: colorCode }}
                className={styles.color}
              ></span>
              <span className={styles.content}>{policyCount}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default TabsCard;
