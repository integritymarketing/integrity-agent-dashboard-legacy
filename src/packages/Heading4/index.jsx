import React from "react";
import styles from "./styles.module.scss";

const Heading4 = ({ className = "", text }) => (
  <h4 className={`${styles.heading4} ${className}`}>{text}</h4>
);

export default Heading4;
