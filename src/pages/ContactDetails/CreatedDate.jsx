import React from "react";
import styles from "./ActivityDetails.module.scss";
import { convertUTCDateToLocalDate } from "utils/dates";
import { dateFormatter } from "utils/dateFormatter";

const CreatedDate = ({ value }) => {
  let date = convertUTCDateToLocalDate(value);
  return (
    <div className={styles.date}>
      <span className={styles.day}>{dateFormatter(date, "MM/DD/YY")}</span>
      <span className={styles.time}>{dateFormatter(date, "h:mm A")}</span>
    </div>
  );
};
export default CreatedDate;
