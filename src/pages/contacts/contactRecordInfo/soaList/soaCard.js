import React from "react";
import { formatDate } from "utils/dates.js";
import clientsService from "services/clientsService";
import * as Sentry from "@sentry/react";

export default ({ linkCode, status, statusDate, soaSummary, ...rest }) => {
  const getStatus = () => {
    switch (status) {
      case "EmailSent":
        return "Sent";
      case "SmsSent":
        return "Sent";
      case "ClientSigned":
        return "Signed";
      case "Completed":
        return "Completed";
      default:
        return "";
    }
  };

  const getProductsbyLinkCode = async (code) => {
    if (!rest || !rest.id) {
      return false;
    }
    await clientsService
      .getSoaByLinkCode(code, rest?.id)
      .then((data) => {
        if (
          data?.leadSection?.products &&
          data?.leadSection?.products?.length > 0
        ) {
          return data?.leadSection?.products;
        }
        return false;
      })
      .catch((e) => {
        Sentry.captureException(e);
      });
  };

  return (
    <>
      <div className="scope-of-app-row">
        <div className="scope-of-app-row-section1">
          <p className={status === "Completed" ? "completed-text" : ""}>
            {getStatus()} <span>{formatDate(statusDate)}</span>
          </p>
        </div>
        <div
          className={` ${
            status === "Completed" ? "completed-text-row" : ""
          } scope-of-app-row-section2`}
        >
          {status === "Completed" ? (
            <ul>
              {getProductsbyLinkCode(linkCode) &&
                getProductsbyLinkCode(linkCode).map((item) => <li>{item}</li>)}
            </ul>
          ) : (
            <p>{soaSummary} </p>
          )}

          {status === "Signed" && (
            <button className="complete-btn">Complete</button>
          )}
          {status === "Completed" && (
            <button className="view---btn">View</button>
          )}
        </div>
      </div>
    </>
  );
};
