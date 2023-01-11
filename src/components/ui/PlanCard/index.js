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
import { PLAN_TYPE_ENUMS } from "../../../constants";
import "./index.scss";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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

  const planType = PLAN_TYPE_ENUMS[planData.planType];

  const now = new Date();
  const year = now.getFullYear();

  const aepSeasonStart = new Date(`10/01/${year}`);
  const aepSeasonMid = new Date(`10/14/${year}`);

  const isMidAEP = now >= aepSeasonStart && now <= aepSeasonMid ? true : false;
  const isJanuary = new Date(effectiveDate).getMonth() === 0 ? true : false;

  const disableEnroll = isMidAEP && isJanuary;

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
        <div className="plan-monthly-costs">
          {planType !== "PDP" && (
            <div
              className={"monthly"}
              onClick={() => {
                if (planType === "MA" && isMobile) {
                  setBreakdownCollapsed(isMobile && !breakdownCollapsed);
                } else return false;
              }}
            >
              {!isMobile && <div className={"label"}>Monthly Plan Premium</div>}
              <div className={"currency"}>
                {currencyFormatter.format(planData.annualPlanPremium / 12)}
              </div>
              {isMobile && (
                <div className={"label"}>
                  <span className={"mnth-mbl"}>/month </span>
                  {planType === "MA" && <ArrowDown />}
                </div>
              )}
            </div>
          )}
          {planType !== "MA" && (
            <div
              className={"monthly rx-drug"}
              onClick={() => {
                setBreakdownCollapsed(isMobile && !breakdownCollapsed);
              }}
            >
              {!isMobile && (
                <div className={"label"}>Est. Monthly RX Drug Cost</div>
              )}
              <div className={"currency"}>
                {currencyFormatter.format(
                  planData.estimatedAnnualDrugCostPartialYear / 12
                )}
              </div>
              {isMobile && (
                <div className={"label"}>
                  <span className={"mnth-mbl"}>/month </span>
                  <ArrowDown />
                </div>
              )}
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
      {getCoverageRecommendations(planData)?.length > 0 && (
        <div className={`coverage ${isMobile ? "mobile" : ""}`}>
          <div className={"label"}>Supplemental Coverage Recommendations:</div>
          <div className="list">{getCoverageRecommendations(planData)}</div>
        </div>
      )}
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
          {!planData.nonLicensedPlan && (
            <Button
              label={"Enroll"}
              disabled={disableEnroll}
              onClick={() => onEnrollClick(planData.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}