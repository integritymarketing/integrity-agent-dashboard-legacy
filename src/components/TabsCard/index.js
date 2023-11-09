import React from "react";
import usePreferences from "hooks/usePreferences";
import styles from "./styles.module.scss";

const Widget = ({
  index,
  tab,
  statusIndex,
  onTabClick,
  isPS_widget,
  isPS_widgetOne,
  tabCount,
}) => {
  const { policyCount, policyStatusColor, policyStatus } = tab;
  const tabWidth = isPS_widget ? "45%" : 100 / tabCount - 0.5;

  return (
    <div
      className={styles.tab}
      style={{ width: `${!isPS_widgetOne ? `${tabWidth}%` : "100%"}` }}
    >
      <span className={styles.tabHeading}>{policyStatus}</span>
      <div
        onClick={() => onTabClick(index, policyCount)}
        className={`${styles.tabContent} ${
          index === statusIndex ? styles.selected : ""
        } ${isPS_widget ? styles.isPS_widget : ""} ${
          isPS_widgetOne ? styles.isPS_widgetOne : ""
        }`}
      >
        <span
          style={{ backgroundColor: policyStatusColor }}
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
  const defaultIndex = page === "policySnapshot" ? 0 : 0;
  const [, setValue] = usePreferences(defaultIndex, preferencesKey);

  const onTabClick = (index, policyCount) => {
    handleWidgetSelection(index, policyCount);
    setValue(index, preferencesKey);
  };

  const isPS_widget = isMobile;

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
                    tabCount={tabs.length}
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
                    tabCount={tabs.length}
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
                tabCount={tabs.length}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
export default TabsCard;
