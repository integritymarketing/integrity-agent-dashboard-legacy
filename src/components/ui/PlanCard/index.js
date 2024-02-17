/* eslint-disable max-lines-per-function */
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";

import { capitalizeFirstLetter, formatUnderScoreString } from "utils/shared-utils/sharedUtility";
import shouldDisableEnrollButtonBasedOnEffectiveDate from "utils/shouldDisableEnrollButtonBasedOnEffectiveDate";

import useRoles from "hooks/useRoles";

import PreEnrollPDFModal from "components/SharedModals/PreEnrollPdf";
import Arrow from "components/icons/down";

import { calculateMonthlyDrugCost, calculatePartialYearDrugCost } from "./calculatePartialDrugCost";
import CostBreakdowns from "./cost-breakdowns";
import "./index.scss";
import PlanCoverage from "./plan-coverage/PlanCoverage";
import SelfRecommendation from "./self-recommendation/SelfRecommendation";
import useAnalytics from "hooks/useAnalytics";
import { PLAN_TYPE_ENUMS } from "../../../constants";
import { Button } from "../Button";
import Rating from "../Rating";

import EnrollBack from "images/enroll-btn-back.svg";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const LOGO_BASE_URL = "https://contentserver.destinationrx.com/ContentServer/DRxProductContent/PlanLogo/";

const getCoverageRecommendations = (planData) => {
    if (!planData?.crossUpSellPlanOptions) {
        return false;
    }

    const list = { ...planData?.crossUpSellPlanOptions };
    const coverageArray = [];
    Object.keys(list).map((keyName) => {
        if (list[keyName] === "1") {
            const value = keyName.includes("_") ? formatUnderScoreString(keyName) : capitalizeFirstLetter(keyName);

            coverageArray.push(value);
        }
        return keyName;
    });
    return coverageArray.join(", ");
};

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
    leadId,
}) {
    const [breakdownCollapsed, setBreakdownCollapsed] = useState(isMobile);
    const [preCheckListPdfModal, setPreCheckListPdfModal] = useState(false);
    const { contactId } = useParams();
    const { fireEvent } = useAnalytics();

    const { logoURL } = planData;
    const checkForImage = logoURL && logoURL.match(/.(jpg|jpeg|png|gif)$/i) ? logoURL : false;

    const planType = PLAN_TYPE_ENUMS[planData.planType];

    const { isNonRTS_User } = useRoles();

    const disableEnroll = isNonRTS_User || shouldDisableEnrollButtonBasedOnEffectiveDate(effectiveDate);

    const validatePartialYearDrugCost = calculatePartialYearDrugCost(
        planData.estimatedAnnualDrugCostPartialYear,
        planData?.drugPremium,
        effectiveDate
    );
    const validatePartialMonthlyDrugCost = calculateMonthlyDrugCost(
        planData.estimatedAnnualDrugCostPartialYear,
        planData?.drugPremium,
        effectiveDate
    );
    return (
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
                    <div className={"carrier-name cr-name-mbl"}>{planData?.marketingName}</div>
                    {!isMobile && (
                        <div className={"rating-container"}>
                            <Rating value={planData.planRating} />
                        </div>
                    )}
                </div>
            )}
            <div className={`premiums ${isMobile ? "mobile" : ""}`}>
                <div className={`plan-monthly-costs ${!breakdownCollapsed && isMobile ? "plan-ms-open" : ""}`}>
                    <div
                        className={"monthly"}
                        onClick={() => {
                            if (planType === "MA" && isMobile) {
                                setBreakdownCollapsed(isMobile && !breakdownCollapsed);
                            } else {
                                return false;
                            }
                        }}
                    >
                        <div className={"label"}>Monthly Plan Premium</div>
                        <div className={"currency"}>{currencyFormatter.format(planData.annualPlanPremium / 12)}</div>
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
                                    {validatePartialMonthlyDrugCost === "N/A"
                                        ? "N/A"
                                        : currencyFormatter.format(validatePartialMonthlyDrugCost)}
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
                <div className={`costs-breakdown ${breakdownCollapsed ? "collapsed" : ""}`}>
                    <CostBreakdowns planData={planData} effectiveDate={effectiveDate} />
                </div>
            </div>

            {validatePartialYearDrugCost === "N/A" && planType !== "MA" && (
                <div>
                    <Alert severity="warning">
                        Plan cost data temporarily unavailable, Please add a pharmacy to the contact record or try again
                        later.
                    </Alert>
                </div>
            )}
            <PlanCoverage
                contact={contact}
                planData={planData}
                contactId={contactId}
                planName={planData?.planName}
                refresh={refresh}
            />
            {getCoverageRecommendations(planData)?.length > 0 && (
                <div className={`coverage ${isMobile ? "mobile" : ""}`}>
                    <SelfRecommendation pills={getCoverageRecommendations(planData)} />
                </div>
            )}

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
                <div onClick={() => onDetailsClick(planData.id)} className="planDetailsBtn">
                    Plan Details
                </div>
                {!planData.nonLicensedPlan && (
                    <Button
                        label={"Apply"}
                        onClick={() => {
                            setPreCheckListPdfModal(true);
                            fireEvent("Health Apply CTA Clicked", {
                                leadid: leadId,
                                line_of_business: "Health",
                                product_type: PLAN_TYPE_ENUMS[planData.planType]?.toLowerCase(),
                            });
                        }}
                        icon={<img src={EnrollBack} alt="enroll" />}
                        className={"enroll-btn"}
                        disabled={disableEnroll}
                        style={disableEnroll ? { opacity: 0.5, pointerEvent: "none" } : null}
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
    );
}
