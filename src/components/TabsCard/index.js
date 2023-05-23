import React, { useState } from "react";
import styles from "./styles.module.scss";
const DEFAULT_TABS = [
  {
    heading: "Requested Callbacks",
    value: 3,
  },
  {
    heading: "Reminders",
    value: 34,
  },
  {
    heading: "Unlinked Calls",
    value: 4,
  },
  {
    heading: "Unlinked Policies",
    value: 8,
  },
];
const TabsCard = ({
  tabs = DEFAULT_TABS,
  selectedIndex = 2,
  onTabChange = () => {},
}) => {
  const [setSelectedIndex] = useState(selectedIndex);

  const onTabClick = (index, tab) => {
    setSelectedIndex(index);
    onTabChange(index, tab);
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
                i === selectedIndex ? styles.selected : ""
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
