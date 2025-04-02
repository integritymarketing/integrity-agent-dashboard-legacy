import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import UnLinkedTextAndCallsCard from './UnLinkedTextAndCallsCard';
import styles from './styles.module.scss';

const UnLinkedTextAndCalls = ({ taskList }) => {
  return (
    <>
      <Box className={styles.cardContainer}>
        {taskList.map(data => {
          return <UnLinkedTextAndCallsCard key={data.contact} task={data} />;
        })}
      </Box>
    </>
  );
};

UnLinkedTextAndCalls.propTypes = {
  taskList: PropTypes.array,
};

export default UnLinkedTextAndCalls;
