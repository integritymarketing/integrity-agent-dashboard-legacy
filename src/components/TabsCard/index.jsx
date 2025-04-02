import React from 'react';
import Box from '@mui/material/Box';

import PropTypes from 'prop-types';

import { DesktopTab } from './DesktopTab';
import { MobileTab } from './MobileTab';
import styles from './styles.module.scss';

const TabsCard = ({
  tabs,
  selectedTabValue,
  handleWidgetSelection,
  isMobile,
}) => {
  return (
    <Box className={styles.tabContainer}>
      {tabs?.map((tab, index) => (
        <React.Fragment key={tab?.policyStatus + index}>
          {isMobile ? (
            <MobileTab
              key={tab?.policyStatus + index}
              handleWidgetSelection={() =>
                handleWidgetSelection(tab, null, true)
              }
              tab={tab}
              tabCount={tabs.length}
              isSelected={selectedTabValue === tab?.value}
            />
          ) : (
            <DesktopTab
              key={tab?.policyStatus + index}
              handleWidgetSelection={() =>
                handleWidgetSelection(tab, null, true)
              }
              tab={tab}
              selectedTabValue={selectedTabValue}
              tabCount={tabs.length}
              isSelected={selectedTabValue === tab?.value}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

TabsCard.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      policyCount: PropTypes.number,
      policyStatusColor: PropTypes.string,
      policyStatus: PropTypes.string,
    })
  ).isRequired,
  preferencesKey: PropTypes.string,
  statusIndex: PropTypes.number,
  handleWidgetSelection: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default TabsCard;
