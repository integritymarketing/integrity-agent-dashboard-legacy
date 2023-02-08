import React from "react";
import styles from "./styles.module.scss";

const Icon = ({ altText = "", className = "", image }) => (
  <div className={`${className} ${styles.icon}`}>
    {image && <img alt={altText} className={styles.image} src={image} />}
  </div>
);

export default Icon;
