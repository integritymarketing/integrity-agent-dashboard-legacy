import React, { useState } from "react";
import Rating from "../Rating";
import PlanNetworkItem from "./plan-network-item";
import CostBreakdowns from "./cost-breakdowns";
import { Button } from "../Button";
import Arrow from "components/icons/down";
import PreEnrollPDFModal from "components/SharedModals/PreEnrollPdf";
import EnrollBack from "images/enroll-btn-back.svg";

import useRoles from "hooks/useRoles";
import { PLAN_TYPE_ENUMS } from "../../../constants";
import "./index.scss";
import PlanCoverageUnavailable from "./plan-network-unavailable";
import PlanCoverage from "./plan-coverage/PlanCoverage";
import LeadInformationProvider from "hooks/useLeadInformation";
import { useParams } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const LOGO_BASE_URL =
  "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/";

function getProviders(entries, isMobile, isPlanNetworkAvailable) {
  const isApiFailed =
    entries?.filter((provider) => provider.firstName && provider.lastName)
      ?.length > 0
      ? false
      : true;

  const items = [];
  if (entries && entries !== null && entries?.length > 0) {
    if (isApiFailed) {
      items.push(<PlanCoverageUnavailable title={"Provider"} />);
    } else {
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
  }
  return items;
}

function getPharmacies(entries, pharmacyMap, isMobile) {
  const isApiFailed =
    entries?.filter((pharmacy) => pharmacy.pharmacyID)?.length > 0
      ? false
      : true;

  const items = [];
  if (entries && entries !== null && entries?.length > 0) {
    if (isApiFailed) {
      items.push(<PlanCoverageUnavailable title={"Pharmacy"} />);
    } else {
      var key = 0;
      for (const entry of entries) {
        const pharmacy = pharmacyMap[entry.pharmacyID];
        if (pharmacy) {
          items.push(
            <PlanNetworkItem
              key={key++}
              name={pharmacy?.name}
              address={pharmacy?.address1}
              inNetwork={entry?.isNetwork}
              isMobile={isMobile}
            />
          );
        }
      }
    }
  }
  return items;
}

export default function PlanCard({
  contact,
  planData,
  pharmacyMap,
  effectiveDate,
  onEnrollClick,
  onDetailsClick,
  isMobile,
  onChangeCompare,
  isChecked,
  isCompareDisabled,
  refresh,
}) {
  let [breakdownCollapsed, setBreakdownCollapsed] = useState(isMobile);
  const [preCheckListPdfModal, setPreCheckListPdfModal] = useState(false);
  const { contactId } = useParams();

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

  const { isNonRTS_User } = useRoles();

  const disableEnroll = isNonRTS_User || (isMidAEP && isJanuary);

  return (
    <LeadInformationProvider leadId={contactId}>
      <div className={"plan-card"}>
        <div className={`header ${isMobile ? "mobile" : ""}`}>
          <div className={"plan-name"}>{planData.planName} </div>
          {checkForImage && (
            <div className={"plan-logo"}>
              {isMobile && (
                <div className={"rating-container"}>
                  <Rating value={planData.planRating} />
                </div>
              )}
              <img src={LOGO_BASE_URL + logoURL} alt="logo" />{" "}
            </div>
          )}
        </div>
        {planData?.marketingName && !isMobile && (
          <div className={"sub-header"}>
            <div className={"carrier-name cr-name-mbl"}>
              {planData?.marketingName}
            </div>
            {!isMobile && (
              <div className={"rating-container"}>
                <Rating value={planData.planRating} />
              </div>
            )}
          </div>
        )}
        <div className={`premiums ${isMobile ? "mobile" : ""}`}>
          <div
            className={`plan-monthly-costs ${
              !breakdownCollapsed && isMobile ? "plan-ms-open" : ""
            }`}
          >
            <div
              className={"monthly"}
              onClick={() => {
                if (planType === "MA" && isMobile) {
                  setBreakdownCollapsed(isMobile && !breakdownCollapsed);
                } else return false;
              }}
            >
              <div className={"label"}>Monthly Plan Premium</div>
              <div className={"currency"}>
                {currencyFormatter.format(planData.annualPlanPremium / 12)}
              </div>
              {/* {isMobile && (
              <div className={"label"}>
                <span className={"mnth-mbl"}>/month </span>
                {planType === "MA" && <ArrowDown />}
              </div>
            )} */}
            </div>

            {planType !== "MA" && (
              <div
                className={" rx-drug"}
                onClick={() => {
                  setBreakdownCollapsed(isMobile && !breakdownCollapsed);
                }}
              >
                <div>
                  <div className={"label"}>Est. Monthly RX Drug Cost</div>
                  <div className={"currency"}>
                    {currencyFormatter.format(
                      planData.estimatedAnnualDrugCostPartialYear /
                        (12 - effectiveDate?.getMonth())
                    )}
                  </div>
                </div>
                <div className={`${!breakdownCollapsed ? "iconReverse" : ""}`}>
                  {isMobile && <Arrow color={"#0052CE"} />}
                </div>

                {/* {isMobile && (
                <div className={"label"}>
                  <span className={"mnth-mbl"}>/month </span>
                  <ArrowDown />
                </div>
              )} */}
              </div>
            )}
          </div>
          <div
            className={`costs-breakdown ${
              breakdownCollapsed ? "collapsed" : ""
            }`}
          >
            <CostBreakdowns planData={planData} effectiveDate={effectiveDate} />
            {((planData.providers !== null && planData.providers?.length > 0) ||
              (planData.pharmacyCosts !== null &&
                planData.pharmacyCosts?.length > 0)) && (
              <div
                className={`in-network mob-show ${isMobile ? "mobile" : ""}`}
              >
                <div className={"label"}>In-Network</div>
                <div className={"items"}>
                  {getProviders(planData.providers, isMobile)}
                  {getPharmacies(planData.pharmacyCosts, pharmacyMap, isMobile)}
                </div>
              </div>
            )}
          </div>
        </div>

        <PlanCoverage
          contact={contact}
          planData={planData}
          contactId={contactId}
          planName={planData?.planName}
          refresh={refresh}
        />

        <div className={`footer ${isMobile ? "mobile" : ""}`}>
          <div className={"compare-check "}>
            <input
              type="checkbox"
              className={"compare-inpt"}
              disabled={isCompareDisabled}
              checked={isChecked}
              onChange={(e) => onChangeCompare(e.target.checked)}
            />
            <span className={"compare-txt"}>Compare</span>{" "}
          </div>
          <div
            onClick={() => onDetailsClick(planData.id)}
            className="planDetailsBtn"
          >
            Plan Details
          </div>
          {!planData.nonLicensedPlan && (
            <Button
              label={"Enroll"}
              onClick={() => onEnrollClick(planData.id)}
              icon={<img src={EnrollBack} alt="enroll" />}
              className={"enroll-btn"}
              disabled={disableEnroll}
              style={
                disableEnroll ? { opacity: 0.5, pointerEvent: "none" } : null
              }
              iconPosition={"right"}
            />
          )}
        </div>
        {preCheckListPdfModal && (
          <PreEnrollPDFModal
            open={preCheckListPdfModal}
            onClose={() => {
              setPreCheckListPdfModal(false);
              onEnrollClick(planData.id);
            }}
          />
        )}
      </div>
    </LeadInformationProvider>
  );
}
