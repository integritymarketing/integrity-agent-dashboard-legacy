import React, { useCallback } from "react";
import {
  formatDate,
  convertToLocalDateTime,
  getHoursDiffBetweenTwoDays,
} from "utils/dates.js";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import OpenIcon from "components/icons/open";
import styles from "./soaCard.module.scss";

const SoaCard = ({
  linkCode,
  status,
  statusDate,
  soaSummary,
  soa,
  soaDestination,
  contactAfterDate,
  ...rest
}) => {
  const getStatus = () => {
    switch (status) {
      case "ClientSigned":
        return "Signed";
      default:
        return status;
    }
  };

  const history = useHistory();
  const getProducts = () => {
    const products = soa?.leadSection?.products ?? [];
    if (products && products?.length > 0) {
      return products;
    }
    return false;
  };

  const soa_status = getStatus();
  const soa_products = getProducts();
  const navigateToConfirmSOA = useCallback(() => {
    history.push(`/contact/${rest?.id}/soa-confirm/${linkCode}`);
  }, [history, rest.id, linkCode]);

  const localDateTime = convertToLocalDateTime(statusDate);

  const getDateTime = (dateString) => {
    const localDateTime = convertToLocalDateTime(dateString);
    const date = formatDate(localDateTime, "MM/dd/yyyy");
    const time = formatDate(localDateTime, "h:mm a").toLowerCase();
    return { date, time };
  };

  const isWithinTwoDays = (contactAfterDate) =>
    getHoursDiffBetweenTwoDays(contactAfterDate, new Date()) < 48;

  return (
    <>
      <div className="scope-of-app-row">
        <div className="scope-of-app-row-section1">
          <p className={soa_status === "Completed" ? "completed-text" : ""}>
            {getStatus()}{" "}
            <span>
              {formatDate(localDateTime, "MM/dd/yyyy")} at{" "}
              {formatDate(localDateTime, "hh:mm a").toLowerCase()}
            </span>
          </p>
        </div>
        <div
          className={` ${
            soa_status === "Completed" ? "completed-text-row" : ""
          } scope-of-app-row-section2`}
        >
          {soa_status === "Completed" && (
            <ul>
              {soa_products &&
                soa_products.map((item) => <li className="li-item">{item}</li>)}
            </ul>
          )}
          {soa_status === "Sent" && (
            <div className="text">
              The scope of appointment has been sent to{" "}
              <span style={{ color: "#4178FF" }}>{soaDestination}</span>{" "}
            </div>
          )}
          {soa_status === "Signed" && (
            <div
              className={` ${
                soa_status === "Signed" ? "completed-text-row" : ""
              }`}
            >
              <div style={{ marginBottom: "16px" }}>
                The scope of appointment is ready for review.
              </div>
              <ul>
                {soa_products &&
                  soa_products.map((item) => (
                    <li className="li-item">{item}</li>
                  ))}
              </ul>
              <div className={styles.contact}>
                <div className={styles.title4}>Contact After</div>
                <div className={styles.dateContainer}>
                  <div className={styles.dateItem}>
                    {getDateTime(contactAfterDate)?.date}
                  </div>
                  <div className={styles.title1}>at</div>
                  <div className={styles.dateItem}>
                    {getDateTime(contactAfterDate)?.time}
                  </div>
                </div>
              </div>
            </div>
          )}

          {soa_status === "Signed" && (
            <div className="soa-card-btn">
              <Button
                label="Complete"
                onClick={navigateToConfirmSOA}
                type="primary"
                icon={<OpenIcon />}
                iconPosition="right"
                className={`${
                  isWithinTwoDays(contactAfterDate) ? styles.disabled : ""
                }`}
              />
            </div>
          )}
          {soa_status === "Completed" && (
            <div className="soa-card-btn">
              <Button
                label="View"
                onClick={navigateToConfirmSOA}
                type="secondary"
                icon={<OpenIcon />}
                iconPosition="right"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SoaCard;
