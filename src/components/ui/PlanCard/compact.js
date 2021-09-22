import React from "react";
import "./index.scss";
import Rating from "../Rating";
import { Button } from "../Button";
import ShareIcon from "../../icons/share";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CompactPlanCard = ({
  planData,
  onEnrollClick,
  onShareClick,
  isMobile,
}) => {
  return (
    <div className={"plan-card plan-card-compact"}>
      <div className={`header ${isMobile ? "mobile" : ""}`}>
        <div className={"plan-name"}>{planData.planName}</div>
        <div className={"monthly-cost"}>
          {currencyFormatter.format(planData.annualPlanPremium / 12)}
          <span className={"label"}>/month</span>
        </div>
      </div>
      <div className={"sub-header"}>
        <div className={"carrier-name"}>{planData.carrierName}</div>
        <div className={"rating-container"}>
          <Rating value={planData.planRating} />
        </div>
      </div>
      <div className={`footer ${isMobile ? "mobile" : ""}`}>
        <Button
          label="Share Plan"
          icon={<ShareIcon />}
          onClick={() => onShareClick(planData.id)}
          type="secondary"
        />
        <Button label="Enroll" onClick={() => onEnrollClick(planData.id)} />
      </div>
    </div>
  );
};

export default CompactPlanCard;
