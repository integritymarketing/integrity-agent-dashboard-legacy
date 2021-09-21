import React, { useCallback } from "react";
import { formatDate } from "utils/dates.js";
import { useHistory } from "react-router-dom";

export default ({ linkCode, status, statusDate, soaSummary, soa, ...rest }) => {
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

  return (
    <>
      <div className="scope-of-app-row">
        <div className="scope-of-app-row-section1">
          <p className={soa_status === "Completed" ? "completed-text" : ""}>
            {getStatus()} <span>{formatDate(statusDate)}</span>
          </p>
        </div>
        <div
          className={` ${
            soa_status === "Completed" ? "completed-text-row" : ""
          } scope-of-app-row-section2`}
        >
          {soa_status === "Completed" ? (
            <ul>
              {soa_products && soa_products.map((item) => <li>{item}</li>)}
            </ul>
          ) : (
            <p>{soaSummary} </p>
          )}

          {soa_status === "Signed" && (
            <button className="complete-btn" onClick={navigateToConfirmSOA}>
              Complete
            </button>
          )}
          {soa_status === "Completed" && (
            <button className="view---btn">View</button>
          )}
        </div>
      </div>
    </>
  );
};
