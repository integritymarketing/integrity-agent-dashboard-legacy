import React from "react";
import usePreferences from "hooks/usePreferences";
import styles from "./styles.module.scss";

const TabsCard = ({ tabs, preferencesKey, statusIndex, setStatusIndex }) => {
  const [, setValue] = usePreferences(0, preferencesKey);

  const onTabClick = (index, tab) => {
    setStatusIndex(index);
    setValue(index, preferencesKey);
  };

  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab, i) => {
        const { heading, value } = tab;
        return (
          <div className={styles.tab} key={heading + i}>
            <span className={styles.tabHeading}>{heading}</span>
            <div
              onClick={() => onTabClick(i, tab)}
              className={`${styles.tabContent} ${
                i === statusIndex ? styles.selected : ""
              }`}
            >
              <span className={styles.content}>{value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default TabsCard;
