import React from "react";
import styles from "./styles.module.scss";

const Strong = ({ className = "", text }) => (
  <strong className={`${styles.strong} ${className}`}>{text}</strong>
);

export default Strong;
