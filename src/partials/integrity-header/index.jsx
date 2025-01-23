import React from 'react';
import styles from './styles.module.scss';
import integrityLogo from "./integrityLogo.svg"; 

const IntegrityHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
      <img src={integrityLogo} alt="Integrity Logo" />
      </div>
    </header>
  );
};


export default IntegrityHeader;
