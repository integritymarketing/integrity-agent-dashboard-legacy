import React, { useState } from "react";
import Rating from "../Rating";
import PlanNetworkItem from "./plan-network-item";
import CostBreakdowns from "./cost-breakdowns";
import { Button } from "../Button";
import ArrowDown from "../../icons/arrow-down";
import {
  capitalizeFirstLetter,
  formatUnderScorestring,
} from "utils/shared-utils/sharedUtility";
import "./index.scss";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const REACT_APP_HIDE_ENROLL_BTN =
  process.env.REACT_APP_HIDE_ENROLL_BTN || false;

const LOGO_BASE_URL =
  "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/";

function getProviders(entries, isMobile, isPlanNetworkAvailable) {
  const items = [];
  if (entries) {
    var key = 0;
    for (const entry of entries) {
      items.push(
        <PlanNetworkItem
          key={key++}
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

function getPharmacies(entries, pharmacyMap, isMobile) {
  const items = [];
  if (entries) {
    var key = 0;
    for (const entry of entries) {
      const pharmacy = pharmacyMap[entry.pharmacyID];
      if (pharmacy) {
        items.push(
          <PlanNetworkItem
            key={key++}
            name={pharmacy.name}
            address={pharmacy.address1}
            inNetwork={entry.isNetwork}
            isMobile={isMobile}
          />
        );
      }
    }
  }
  return items;
}

const getCoverageRecommendations = (planData) => {
  if (!planData?.crossUpSellPlanOptions) return false;

  let list = { ...planData?.crossUpSellPlanOptions };
  let coverageArray = [];
  Object.keys(list).map((keyName) => {
    if (list[keyName] === "1") {
      let value = keyName.includes("_")
        ? formatUnderScorestring(keyName)
        : capitalizeFirstLetter(keyName);

      coverageArray.push(value);
    }
    return keyName;
  });
  return coverageArray.join(", ");
};

export default function PlanCard({
  planData,
  pharmacyMap,
  effectiveDate,
  onEnrollClick,
  onDetailsClick,
  isMobile,
  onChangeCompare,
  isChecked,
  isCompareDisabled,
}) {
  let [breakdownCollapsed, setBreakdownCollapsed] = useState(isMobile);
  const { logoURL } = planData;
  const checkForImage =
    logoURL && logoURL.match(/.(jpg|jpeg|png|gif)$/i) ? logoURL : false;
  return (
    <div className={"plan-card"}>
      <div className={`header ${isMobile ? "mobile" : ""}`}>
        <div className={"compare-check hide-desktop"}>
          <input
            type="checkbox"
            className={"compare-inpt"}
            disabled={isCompareDisabled}
            checked={isChecked}
            onChange={(e) => onChangeCompare(e.target.checked)}
          />
          <span className={"compare-txt"}>Compare</span>{" "}
        </div>
        <div className={"plan-name"}>{planData.planName}</div>
        {checkForImage && (
          <div className={"plan-logo"}>
            <img src={LOGO_BASE_URL + logoURL} alt="logo" />
          </div>
        )}
      </div>
      <div className={"sub-header"}>
        <div className={"carrier-name cr-name-mbl"}>
          {planData?.marketingName}
        </div>
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
              <span className={"mnth-mbl"}>/month </span>
              <ArrowDown />
            </div>
          )}
        </div>
        <div
          className={`costs-breakdown ${breakdownCollapsed ? "collapsed" : ""}`}
        >
          <CostBreakdowns planData={planData} effectiveDate={effectiveDate} />
          <div className={`in-network mob-show ${isMobile ? "mobile" : ""}`}>
            <div className={"label"}>In-Network</div>
            <div className={"items"}>
              {getProviders(planData.providers, isMobile)}
              {getPharmacies(planData.pharmacyCosts, pharmacyMap, isMobile)}
            </div>
          </div>
        </div>
      </div>
      <div className={`in-network ${isMobile ? "mobile" : ""}`}>
        <div className={"items"}>
          {getProviders(
            planData.providers,
            isMobile,
            planData.isPlanNetworkAvailable
          )}

          {getPharmacies(planData.pharmacyCosts, pharmacyMap, isMobile)}
        </div>
      </div>
      <div className={`coverage ${isMobile ? "mobile" : ""}`}>
        <div className={"label"}>Supplemental Coverage Recommendations:</div>
        <div className="list">{getCoverageRecommendations(planData)}</div>
      </div>
      <div className={`footer ${isMobile ? "mobile" : ""}`}>
        <div className={"compare-check cmp-chk-mbl"}>
          <input
            type="checkbox"
            className={"compare-inpt"}
            disabled={isCompareDisabled}
            checked={isChecked}
            onChange={(e) => onChangeCompare(e.target.checked)}
          />
          <span className={"compare-txt"}>Compare</span>{" "}
        </div>
        <div className={"plan-btn-container"}>
          <Button
            label="Plan Details"
            onClick={() => onDetailsClick(planData.id)}
            type="secondary"
          />
          {!REACT_APP_HIDE_ENROLL_BTN && !planData.nonLicensedPlan && (
            <Button label="Enroll" onClick={() => onEnrollClick(planData.id)} />
          )}
        </div>
      </div>
    </div>
  );
}
