import React from "react";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import integrityLogo from "../logo/integrity.svg"; 
/**
 * Footer component for the Integrity application.
 */
const IntegrityFooter = () => {
  return (
    <footer className={styles.integrityFooter}>
      <Link to="/">
        <span className="visually-hidden">Integrity</span>
        <img src={integrityLogo} alt="Integrity Logo" />
      </Link>
      <small className={styles.legalText}>
        <span>&copy; {new Date().getFullYear()}</span> {" "}
        <span>Integrity.</span> <span>All rights reserved.</span>
      </small>
    </footer>
  );
};

export default IntegrityFooter;
