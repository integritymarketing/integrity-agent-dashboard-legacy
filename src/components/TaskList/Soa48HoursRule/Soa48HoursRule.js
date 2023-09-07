import React from "react";
import styles from "./Soa48HoursRule.module.scss";
import { formatDate, convertToLocalDateTime } from "utils/dates";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
// import OpenIcon from "components/icons/open";

function Soa48HoursRule({ taskList }) {
  console.log(taskList);
  const history = useHistory();

  const getDateTime = (dateString) => {
    const localDateTime = convertToLocalDateTime(dateString);
    const date = formatDate(localDateTime, "MM/dd/yyyy");
    const time = formatDate(localDateTime, "hh:mm a").toLowerCase();
    return { date, time };
  };

  const navigateToConfirmSOA = (item) => {
    console.log(item);
    // history.push(`/contact/${rest?.id}/soa-confirm/${linkCode}`);
  };

  return (
    <div className={styles.container}>
      {(taskList || []).map((item, index) => {
        return (
          <div className={styles.item}>
            <div className={styles.section}>
              <div className={styles.title1}>
                Soa sent {getDateTime(item.sentDate).date} to
              </div>
              <div
                className={styles.title2}
              >{`${item.firstName} ${item.lastName}`}</div>
              <div className={styles.title3}>
                {item.phoneNumber || item.sentTo}
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.dateContainer}>
                <div className={styles.title4}>Date Signed</div>
                <div className={styles.title1}>
                  {getDateTime(item.signedDate).date}
                </div>
              </div>
              <div className={styles.dateContainer}>
                <div className={styles.title4}>Time Signed</div>
                <div className={styles.title1}>
                  {getDateTime(item.signedDate).time}
                </div>
              </div>
            </div>
            <div className={`${styles.section} ${styles.contact}`}>
              <div className={styles.title4}>Contact After</div>
              <div className={styles.dateContainer}>
                <div className={styles.dateItem}>
                  {getDateTime(item.contactAfterDate).date}
                </div>
                <div className={styles.title1}>at</div>
                <div className={styles.dateItem}>
                  {getDateTime(item.contactAfterDate).time}
                </div>
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.button}>
                <Button
                  label="Complete"
                  onClick={() => navigateToConfirmSOA(item)}
                  type="primary"
                  //icon={<OpenIcon />}
                  iconPosition="right"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Soa48HoursRule;
