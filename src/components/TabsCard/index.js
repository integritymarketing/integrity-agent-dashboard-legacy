import React from "react";
import usePreferences from "hooks/usePreferences";
import styles from "./styles.module.scss";

const Widget = ({ index, tab, statusIndex, onTabClick, isPS_widget }) => {
  const { policyCount, colorCode, policyStatus } = tab;
  return (
    <div className={styles.tab}>
      <span className={styles.tabHeading}>{policyStatus}</span>
      <div
        onClick={() => onTabClick(index, policyCount)}
        className={`${styles.tabContent} ${
          index === statusIndex ? styles.selected : ""
        } ${isPS_widget ? styles.isPS_widget : ""} `}
      >
        <span
          style={{ backgroundColor: colorCode }}
          className={styles.color}
        ></span>
        <span className={styles.content}>{policyCount}</span>
      </div>
    </div>
  );
};

const TabsCard = ({
  tabs,
  preferencesKey,
  statusIndex,
  handleWidgetSelection,
  page,
  isMobile,
}) => {
  const [, setValue] = usePreferences(0, preferencesKey);

  const onTabClick = (index, policyCount) => {
    handleWidgetSelection(index, policyCount);
    setValue(index, preferencesKey);
  };

  const isPS_widget = isMobile && page === "policySnapshot";

  return (
    <div
      className={`${styles.tabContainer} ${
        isPS_widget ? styles.psMobile : ""
      } `}
    >
      {isPS_widget ? (
        <>
          <div className={styles.widgetRow}>
            {tabs?.map((tab, index) => {
              if (index < 2) {
                return (
                  <Widget
                    key={tab?.policyStatus + index}
                    statusIndex={statusIndex}
                    onTabClick={onTabClick}
                    index={index}
                    tab={tab}
                    isPS_widget={true}
                  />
                );
              } else return null;
            })}
          </div>
          <div className={styles.widgetRow}>
            {tabs?.map((tab, index) => {
              if (index > 1) {
                return (
                  <Widget
                    key={tab?.policyStatus + index}
                    statusIndex={statusIndex}
                    onTabClick={onTabClick}
                    index={index}
                    tab={tab}
                    isPS_widget={true}
                  />
                );
              } else return null;
            })}
          </div>
        </>
      ) : (
        <>
          {tabs?.map((tab, index) => {
            return (
              <Widget
                key={tab?.policyStatus + index}
                statusIndex={statusIndex}
                onTabClick={onTabClick}
                index={index}
                tab={tab}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
export default TabsCard;
