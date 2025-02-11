import React from "react";
import styles from "./styles.module.scss";

const Dot = ({ className = "", isActive = false }) => {
  const activeClass = isActive ? styles.isActive : "";

  return <div className={`${activeClass} ${className} ${styles.dot}`} />;
};

export default Dot;
