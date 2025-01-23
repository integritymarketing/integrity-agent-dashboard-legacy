import React from "react";
import styles from "./styles.module.scss";

const Heading3 = ({ className = "", text }) => (
  <h3 className={`${styles.heading3} ${className}`}>{text}</h3>
);

export default Heading3;
