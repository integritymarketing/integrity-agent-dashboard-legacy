import React from "react";
import "./index.scss";
import Rating from "../Rating";
import { Button } from "../Button";
import Popover from "components/ui/Popover";
import ShareIcon from "components/icons/vector";
import ShareIconDisabled from "components/icons/vector-disabled";
import Info from "components/icons/info-blue";
import useRoles, { Roles } from "hooks/useRoles";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const REACT_APP_HIDE_ENROLL_BTN =
  process.env.REACT_APP_HIDE_ENROLL_BTN || false;

const CompactPlanCard = ({
  planData,
  onEnrollClick,
  onShareClick,
  isMobile,
  onlyButtons = false,
}) => {
  const { documents } = planData;
  const { hasRole } = useRoles();
  const nonRTS_USER = hasRole(Roles.NonRts);

  const buttons = (
    <div className={`footer ${isMobile ? "mobile" : ""}`}>
      {documents === null || documents?.length === 0 ? (
        <Popover
          openOn="hover"
          icon={<Info />}
          title={"No Plans to share"}
          positions={["right", "bottom"]}
        >
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

      {!planData.nonLicensedPlan &&
        !nonRTS_USER &&
        process.env.REACT_APP_NON_RTS_FLAG !==
          "hide"(
            <Button
              label={"Enroll"}
              onClick={() => onEnrollClick(planData.id)}
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
            <div className="currency">
              {currencyFormatter.format(planData.annualPlanPremium / 12)}
            </div>
            <div className={"label"}> Monthly Premium</div>
          </div>
        </div>
      ) : null}
      {!REACT_APP_HIDE_ENROLL_BTN &&
        onEnrollClick &&
        !planData.nonLicensedPlan &&
        !isMobile &&
        buttons}
    </div>
  );
};

export default CompactPlanCard;
