import React from "react";
import styles from "./styles.module.scss";
import check from "partials/global-nav-v2/Check.svg";

export default function CheckMark({ show }) {
  return show ? (
    <img src={check} alt={"check"} className={styles.check} />
  ) : (
    <></>
  );
}
