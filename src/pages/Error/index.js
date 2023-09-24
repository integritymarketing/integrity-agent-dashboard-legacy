import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const ErrorPage = ({ errorMessage }) => (
  <div className={styles.errorContainer}>
    <h1 className={styles.errorHeading}>An error has occurred</h1>
    <p className={styles.errorMessage}>{errorMessage}</p>
  </div>
);

ErrorPage.propTypes = {
  errorMessage: PropTypes.string
};

ErrorPage.defaultProps = {
  errorMessage: 'Something went wrong.'
};

export default ErrorPage;
