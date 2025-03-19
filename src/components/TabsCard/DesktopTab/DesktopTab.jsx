import Box from '@mui/material/Box';

import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const DesktopTab = ({ index, tab, statusIndex, onTabClick, tabCount }) => {
  const { policyCount, policyStatusColor, policyStatus } = tab;
  const tabWidth = 100 / tabCount - 0.5;

  const updatedPolicyStatus =
    policyStatus === 'UnlinkedPolicies'
      ? 'Unlinked'
      : policyStatus === 'PlanEnroll Leads'
      ? 'Ready to Connect'
      : policyStatus;

  return (
    <Box className={styles.tab} style={{ width: `${tabWidth}%` }}>
      <Box className={styles.tabHeading}>{updatedPolicyStatus}</Box>
      <Box
        onClick={() => onTabClick(index, policyCount)}
        className={`${styles.tabContent} ${
          index === statusIndex && styles.selected
        }`}
      >
        <Box
          style={{ backgroundColor: policyStatusColor }}
          className={styles.color}
        ></Box>
        <Box className={styles.content}>{policyCount}</Box>
      </Box>
    </Box>
  );
};

DesktopTab.propTypes = {
  index: PropTypes.number,
  tab: PropTypes.shape({
    policyCount: PropTypes.number,
    policyStatusColor: PropTypes.string,
    policyStatus: PropTypes.string,
  }).isRequired,
  statusIndex: PropTypes.number,
  onTabClick: PropTypes.func,
  tabCount: PropTypes.number,
};

export default DesktopTab;
