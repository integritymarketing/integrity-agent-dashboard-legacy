import React, { forwardRef } from "react";

import image from "./image.png";
import website from "./images/website.png";

import styles from "./styles.module.scss";

const Mobile = forwardRef(({ className = "" }, ref) => (
  <div className={`${className} ${styles.mobile}`} ref={ref}>
    <img alt="Mobile" className={styles.image} src={image} />

    <img alt="Website" className={styles.website} src={website} />
  </div>
));

export default Mobile;
