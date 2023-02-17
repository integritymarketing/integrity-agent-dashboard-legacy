import React from "react";
import styles from "./styles.module.scss";

const ItemsContainer = ({ children, className = "" }) => (
  <div className={`${className} ${styles.itemsContainer}`}>{children}</div>
);

export default ItemsContainer;
