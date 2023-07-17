import React, { useCallback } from "react";
import { formatDate } from "utils/dates.js";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";

export default ({
  linkCode,
  status,
  statusDate,
  soaSummary,
  soa,
  soaDestination,
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
          {soa_status === "Completed" && (
            <ul>
              {soa_products && soa_products.map((item) => <li>{item}</li>)}
            </ul>
          )}
          {soa_status === "Sent" && (
            <div>
              The scope of appointment has been sent to {soaDestination}{" "}
            </div>
          )}
          {soa_status === "Signed" && (
            <div>The scope of appointment is for ready for review.</div>
          )}

          {soa_status === "Signed" && (
            <div className="soa-card-btn">
              <Button
                label="Complete"
                onClick={navigateToConfirmSOA}
                type="primary"
              />
            </div>
          )}
          {soa_status === "Completed" && (
            <div className="soa-card-btn">
              <Button
                label="View"
                onClick={navigateToConfirmSOA}
                type="secondary"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
