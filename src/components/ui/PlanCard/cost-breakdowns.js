import React from "react";
import planTypeValueMap from "components/ui/PlanCard/plan-type-map.json";
import { PLAN_TYPE_ENUMS } from "../../../constants";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default ({ planData, effectiveDate }) => {
  const rows = [];
  const planTypeBreakdowns =
    planTypeValueMap[PLAN_TYPE_ENUMS[planData.planType]];
  for (const breakdown of planTypeBreakdowns) {
    let subtext = breakdown.subtext || "";
    if (subtext) {
      subtext = subtext.replace("${effectiveDate}", effectiveDate);
    }
    rows.push(
      <div className={"cost-row"}>
        <div>
          <div className={"label"}>{breakdown.label}</div>
          <div className={"filler"}></div>
          <div className={"currency"}>
            {currencyFormatter.format(planData[breakdown.field])}
          </div>
        </div>
        <div className={"subtext"}>{subtext}</div>
      </div>
    );
  }
  return rows;
};
