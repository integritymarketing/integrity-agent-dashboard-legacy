import React, { useState } from "react";
import { useParams } from "react-router-dom";

import shouldDisableEnrollButtonBasedOnEffectiveDate from "utils/shouldDisableEnrollButtonBasedOnEffectiveDate";

import useRoles from "hooks/useRoles";
import useAnalytics from "hooks/useAnalytics";

import PreEnrollPDFModal from "components/SharedModals/PreEnrollPdf";
import Info from "components/icons/info-blue";
import ShareIcon from "components/icons/vector";
import ShareIconDisabled from "components/icons/vector-disabled";
import Popover from "components/ui/Popover";

import { PLAN_TYPE_ENUMS } from "constants";

import "./index.scss";

import { Button } from "../Button";
import Rating from "../Rating";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const CompactPlanCard = ({ planData, onEnrollClick, onShareClick, isMobile, onlyButtons = false, effectiveDate }) => {
    const [preCheckListPdfModal, setPreCheckListPdfModal] = useState(false);
    const { contactId } = useParams();
    const { documents } = planData;
    const { isNonRTS_User } = useRoles();
    const { fireEvent } = useAnalytics();

    const disableEnroll = shouldDisableEnrollButtonBasedOnEffectiveDate(effectiveDate);

    const buttons = (
        <div className={`footer ${isMobile ? "mobile" : ""}`}>
            {documents === null || documents?.length === 0 ? (
                <Popover openOn="hover" icon={<Info />} title={"No Plans to share"} positions={["right", "bottom"]}>
                    <Button
                        disabled={true}
                        label="Share Plan"
                        icon={<ShareIconDisabled />}
                        onClick={() => onShareClick(planData.id)}
                        type="secondary"
                    />
                </Popover>
            ) : (
                <Button
                    label="Share Plan"
                    icon={<ShareIcon />}
                    onClick={() => onShareClick(planData.id)}
                    type="secondary"
                />
            )}

            {!planData.nonLicensedPlan && !isNonRTS_User && (
                <Button
                    label="Apply"
                    onClick={() => {
                        fireEvent("Health Apply CTA Clicked", {
                            leadid: String(contactId),
                            line_of_business: "Health",
                            product_type: PLAN_TYPE_ENUMS[planData.planType]?.toLowerCase(),
                        });
                        setPreCheckListPdfModal(true);
                    }}
                    disabled={disableEnroll}
                />
            )}
        </div>
    );

    return onlyButtons ? (
        <div className={`plan-card-buttons`}>{buttons}</div>
    ) : (
        <div className={`plan-card plan-card-compact ${isMobile ? "mobile" : ""}`}>
            <div className={`header ${isMobile ? "mobile" : ""}`}>
                <div className={"plan-name"}>{planData.planName}</div>
                {isMobile ? null : (
                    <div className={"monthly-cost"}>
                        {currencyFormatter.format(planData.annualPlanPremium / 12)}
                        <span className={"label"}>/month</span>
                    </div>
                )}
            </div>
            <div className={`sub-header ${isMobile ? "mobile" : ""}`}>
                <div className={"carrier-name"}>{planData.carrierName}</div>
                <div className={"rating-container"}>
                    <Rating value={planData.planRating} />
                </div>
            </div>
            {isMobile ? (
                <div className={`footer ${isMobile ? "mobile" : ""}`}>
                    <div className={"monthly-cost"}>
                        <div className="currency">{currencyFormatter.format(planData.annualPlanPremium / 12)}</div>
                        <div className={"label"}> Monthly Premium</div>
                    </div>
                </div>
            ) : null}
            {onEnrollClick && !planData.nonLicensedPlan && !isMobile && buttons}
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
};

export default CompactPlanCard;
