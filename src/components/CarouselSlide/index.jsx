import React from "react";
import styles from "./styles.module.scss";

const CarouselSlide = ({ children, className = "", style = {} }) => (
  <div className={`${className} ${styles.carouselSlide}`} style={style}>
    {children}
  </div>
);

export default CarouselSlide;
