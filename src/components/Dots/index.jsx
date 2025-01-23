import React from "react";
import Dot from "components/Dot";

import styles from "./styles.module.scss";

const Dots = ({ activeDot = 0, className = "", count = 0 }) => (
  <div className={`${className} ${styles.dots}`}>
    {Array.from({ length: count }).map((_, index) => (
      <Dot isActive={activeDot === index} key={index} />
    ))}
  </div>
);

export default Dots;
