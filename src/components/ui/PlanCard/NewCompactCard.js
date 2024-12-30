import React, { useState } from "react";

import useRoles from "hooks/useRoles";

import PreEnrollPDFModal from "components/SharedModals/PreEnrollPdf";
import Info from "components/icons/info-blue";
import Popover from "components/ui/Popover";

import "./index.scss";

import { Button } from "../Button";
import Rating from "../Rating";

import EnrollBack from "images/enroll-btn-back.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowShare} from "@awesome.me/kit-7ab3488df1/icons/kit/custom";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const CompactPlanCardNew = ({ planData, onEnrollClick, onShareClick, isMobile, onlyButtons = false }) => {
    const [preCheckListPdfModal, setPreCheckListPdfModal] = useState(false);
    const { documents } = planData;
    const { isNonRTS_User } = useRoles();

    const buttons = (
        <div className={`footer ${isMobile ? "mobile controlButtons" : ""}`}>
            {documents === null || documents?.length === 0 ? (
                <Popover openOn="hover" icon={<Info />} title={"No Plans to share"} positions={["right", "bottom"]}>
                    <Button
                        disabled={true}
                        label="Share"
                        icon={<FontAwesomeIcon icon={faArrowShare} />}
                        onClick={() => onShareClick(planData.id)}
                        type="secondary"
                        className={"share-btn mobile"}
                    />
                </Popover>
            ) : (
                <Button
                    label="Share"
                    icon={<FontAwesomeIcon icon={faArrowShare} />}
                    onClick={() => onShareClick(planData.id)}
                    type="secondary"
                    className={"share-btn mobile"}
                    iconPosition={"right"}
                />
            )}

            {!planData.nonLicensedPlan && !isNonRTS_User && (
                <Button
                    label={"Apply"}
                    onClick={() => setPreCheckListPdfModal(true)}
                    icon={<img src={EnrollBack} alt="enroll" />}
                    className={"enroll-btn"}
                    iconPosition={"right"}
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
                        <span className={"label"}>/mo</span>
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
                <div className={`footer ${isMobile ? "mobile monthly-cost-container" : ""}`}>
                    <div className={"monthly-cost"}>
                        <div className={"label"}> Monthly Premium</div>
                        <div className="currency">{currencyFormatter.format(planData.annualPlanPremium / 12)}</div>
                    </div>
                </div>
            ) : null}
            {onEnrollClick && !planData.nonLicensedPlan && buttons}
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

export default CompactPlanCardNew;
