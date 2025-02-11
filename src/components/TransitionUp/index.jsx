import React from "react";
import { useInView } from "react-intersection-observer";

import styles from "./styles.module.scss";

const TransitionUp = ({ children, className = "" }) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  return (
    <div
      className={`${className} ${inView ? styles.animate : ""} ${
        styles.transitionUp
      }`}
      ref={ref}
    >
      {children}
    </div>
  );
};

export default TransitionUp;
