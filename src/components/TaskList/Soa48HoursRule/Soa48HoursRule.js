import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import {
  formatDate,
  convertToLocalDateTime,
  getHoursDiffBetweenTwoDays,
} from "utils/dates";
import { Button } from "components/ui/Button";
import OpenIcon from "components/icons/open";
import styles from "./Soa48HoursRule.module.scss";

const Soa48HoursRule = ({ taskList, isMobile, refreshData }) => {
  const history = useHistory();

  const getDateTime = (dateString) => {
    const localDateTime = convertToLocalDateTime(dateString);
    const date = formatDate(localDateTime, "MM/dd/yyyy");
    const time = formatDate(localDateTime, "h:mm a").toLowerCase();
    return { date, time };
  };

  const navigateToConfirmSOA = (item) => {
    history.push(`/contact/${item?.leadId}/soa-confirm/${item?.soaLinkCode}`);
    refreshData(item?.id);
  };

  const isWithinTwoDays = (contactAfterDate) =>
    getHoursDiffBetweenTwoDays(contactAfterDate, new Date()) < 48;

  return (
    <div className={styles.container}>
      {taskList?.map((item) => (
        <div className={styles.item} key={item.id}>
          <div className={styles.section}>
            <div className={styles.title1}>
              Soa sent {getDateTime(item?.sentDate).date} to
            </div>
            <div className={styles.title2}>
              {item ? `${item.firstName || ""} ${item.lastName || ""}` : ""}
            </div>
            <div className={styles.title3}>
              {item ? item.phoneNumber || item.sentTo : ""}
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.dateContainer}>
              <div className={styles.title4}>Date Signed: </div>
              <div className={styles.title1}>
                {getDateTime(item?.signedDate).date}
              </div>
            </div>
            <div className={styles.dateContainer}>
              <div className={styles.title4}>Time Signed: </div>
              <div className={styles.title1}>
                {getDateTime(item?.signedDate).time}
              </div>
            </div>
          </div>
          <div className={`${styles.section} ${styles.contact}`}>
            <div className={styles.title4}>Contact After</div>
            <div className={styles.dateContainer}>
              <div className={styles.dateItem}>
                {getDateTime(item?.contactAfterDate).date}
              </div>
              <div className={styles.title1}>at</div>
              <div className={styles.dateItem}>
                {getDateTime(item?.contactAfterDate).time}
              </div>
            </div>
          </div>
          <div
            className={`${styles.section} ${styles.action} ${
              isMobile ? styles.mobileIcon : ""
            }`}
          >
            <Button
              className={`${styles.completeBtn} ${
                isWithinTwoDays(item?.contactAfterDate) ? styles.disabled : ""
              }`}
              label={isMobile ? "" : "Complete"}
              onClick={() => navigateToConfirmSOA(item)}
              type="primary"
              icon={<OpenIcon />}
              iconPosition="right"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

Soa48HoursRule.propTypes = {
  taskList: PropTypes.array.isRequired,
  isMobile: PropTypes.bool.isRequired,
  refreshData: PropTypes.func.isRequired,
};

export default Soa48HoursRule;
