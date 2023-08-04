import React from "react";
import Rating from "../Rating";
import { Button } from "../Button";
import Popover from "components/ui/Popover";
import NewShareIcon from "images/new-share-icon.svg";
import EnrollBack from "images/enroll-btn-back.svg";
import Info from "components/icons/info-blue";
import useRoles from "hooks/useRoles";
import "./index.scss";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const REACT_APP_HIDE_ENROLL_BTN =
  process.env.REACT_APP_HIDE_ENROLL_BTN || false;

const CompactPlanCardNew = ({
  planData,
  onEnrollClick,
  onShareClick,
  isMobile,
  onlyButtons = false,
}) => {
  const { documents } = planData;
  const { isNonRTS_User } = useRoles();

  const buttons = (
    <div className={`footer ${isMobile ? "mobile controlButtons" : ""}`}>
      {documents === null || documents?.length === 0 ? (
        <Popover
          openOn="hover"
          icon={<Info />}
          title={"No Plans to share"}
          positions={["right", "bottom"]}
        >
          <Button
            disabled={true}
            label="Share"
            icon={<img src={NewShareIcon} alt="share" />}
            onClick={() => onShareClick(planData.id)}
            type="secondary"
            className={"share-btn mobile"}
          />
        </Popover>
      ) : (
        <Button
          label="Share"
          icon={<img src={NewShareIcon} alt="share" />}
          onClick={() => onShareClick(planData.id)}
          type="secondary"
          className={"share-btn mobile"}
          iconPosition={"right"}
        />
      )}

      {!planData.nonLicensedPlan && !isNonRTS_User && (
        <Button
          label={"Enroll"}
          onClick={() => onEnrollClick(planData.id)}
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
        <div
          className={`footer ${
            isMobile ? "mobile monthly-cost-container" : ""
          }`}
        >
          <div className={"monthly-cost"}>
            <div className={"label"}> Monthly Premium</div>
            <div className="currency">
              {currencyFormatter.format(planData.annualPlanPremium / 12)}
            </div>
          </div>
        </div>
      ) : null}
      {!REACT_APP_HIDE_ENROLL_BTN &&
        onEnrollClick &&
        !planData.nonLicensedPlan &&
        buttons}
    </div>
  );
};

export default CompactPlanCardNew;
