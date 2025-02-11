import React from "react";
import styles from "./styles.module.scss";

const Paragraph = ({ className = "", text, children }) => (
  <div className={`${styles.paragraph} ${className}`}>
    {text}
    {children}
  </div>
);

export default Paragraph;
