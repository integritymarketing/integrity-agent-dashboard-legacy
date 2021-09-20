import React, { useState } from "react";
import Rating from "../Rating";
import PlanNetworkItem from "./plan-network-item";
import CostBreakdowns from "./cost-breakdowns";
import { Button } from "../Button";
import ArrowDown from "../../icons/arrow-down";
import "./index.scss";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const LOGO_BASE_URL =
  "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/";

function getProviders(entries, isMobile) {
  const items = [];
  if (entries) {
    for (const entry of entries) {
      items.push(
        <PlanNetworkItem
          name={entry.firstName + " " + entry.lastName}
          address={entry?.address?.streetLine1}
          inNetwork={entry.inNetwork}
          isMobile={isMobile}
        />
      );
    }
  }
  return items;
}

function getPharmacies(entries, isMobile) {
  const items = [];
  if (entries) {
    for (const entry of entries) {
      items.push(
        <PlanNetworkItem
          name={entry.name}
          address={entry.address1}
          inNetwork={entry.isNetwork}
          isMobile={isMobile}
        />
      );
    }
  }
  return items;
}

export default function PlanCard({
  planData,
  effectiveDate,
  onEnrollClick,
  onDetailsClick,
  isMobile,
}) {
  let [breakdownCollapsed, setBreakdownCollapsed] = useState(isMobile);
  return (
    <div className={"plan-card"}>
      <div className={`header ${isMobile ? "mobile" : ""}`}>
        <div className={"plan-name"}>{planData.planName}</div>
        <div className={"plan-logo"}>
          <img src={LOGO_BASE_URL + planData.logoURL} alt="logo" />
        </div>
      </div>
      <div className={"sub-header"}>
        <div className={"carrier-name"}>{planData.carrierName}</div>
        <div className={"rating-container"}>
          <Rating value={planData.planRating} />
        </div>
      </div>
      <div className={`premiums ${isMobile ? "mobile" : ""}`}>
        <div
          className={"monthly"}
          onClick={() => {
            setBreakdownCollapsed(isMobile && !breakdownCollapsed);
          }}
        >
          {!isMobile && <div className={"label"}>Monthly Premium</div>}
          <div className={"currency"}>
            {currencyFormatter.format(planData.annualPlanPremium / 12)}
          </div>
          {isMobile && (
            <div className={"label"}>
              /month <ArrowDown />
            </div>
          )}
        </div>
        <div
          className={`costs-breakdown ${breakdownCollapsed ? "collapsed" : ""}`}
        >
          <CostBreakdowns planData={planData} effectiveDate={effectiveDate} />
        </div>
      </div>
      <div className={`in-network ${isMobile ? "mobile" : ""}`}>
        <div className={"label"}>In-Network</div>
        <div className={"items"}>
          {getProviders(planData.providers, isMobile)}
          {getPharmacies(planData.pharmacyCosts, isMobile)}
        </div>
      </div>
      <div className={`footer ${isMobile ? "mobile" : ""}`}>
        <Button
          label="Plan Details"
          onClick={() => onDetailsClick(planData.id)}
          type="secondary"
        />
        <Button label="Enroll" onClick={() => onEnrollClick(planData.id)} />
      </div>
    </div>
  );
}
