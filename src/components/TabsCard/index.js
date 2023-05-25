import React, { useState } from "react";
import usePreferences from "hooks/usePreferences";
import styles from "./styles.module.scss";

const TabsCard = ({
  tabs,
  selectedIndex = 2,
  onTabChange = () => {},
  preferencesKey,
}) => {
  const [value, setValue] = usePreferences(null, preferencesKey);

  const [index, setSelectedIndex] = useState(value);

  const onTabClick = (index, tab) => {
    setSelectedIndex(index);
    onTabChange(index, tab);
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
                i === index ? styles.selected : ""
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
