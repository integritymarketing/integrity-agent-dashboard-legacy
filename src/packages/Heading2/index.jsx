import React from "react";
import styles from "./styles.module.scss";

const Heading2 = ({ className = "", text }) => (
  <h2 className={`${styles.heading2} ${className}`}>{text}</h2>
);

export default Heading2;
