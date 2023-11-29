import React from "react";
import planTypeValueMap from "components/ui/PlanCard/plan-type-map.js";
import { PLAN_TYPE_ENUMS } from "../../../constants";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CostBreakdowns = ({ planData, effectiveDate }) => {
  const rows = [];
  const planTypeBreakdowns =
    planTypeValueMap[PLAN_TYPE_ENUMS[planData.planType]];
  var key = 0;
  for (const i in planTypeBreakdowns) {
    const breakdown = planTypeBreakdowns[i];
    let subtext = breakdown.subtext || "";
    if (subtext) {
      subtext = subtext.replace(
        "{effectiveDate}",
        `${effectiveDate.toLocaleString("default", {
          month: "long",
        })} ${effectiveDate.getFullYear()} `
      );
    }
    var value = planData[breakdown.field];
    if (breakdown.function) {
      value = breakdown.function(planData, effectiveDate);
    }
    rows.push(
      <div className={"cost-row"} key={key++}>
        <div>
          <div className={"label"}>{breakdown.label}</div>

          <div className={"filler"}></div>
          <div className={"currency"}>{value === "N/A" ? "N/A" : currencyFormatter.format(value)}</div>        </div>
        <div className={"subtext"}>{subtext}</div>
      </div>
    );
  }
  return rows;
};

export default CostBreakdowns;
