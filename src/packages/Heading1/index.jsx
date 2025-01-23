import React from "react";
import styles from "./styles.module.scss";

const Heading1 = ({ className = "", text }) => (
  <h1 className={`${styles.heading1} ${className}`}>{text}</h1>
);

export default Heading1;
