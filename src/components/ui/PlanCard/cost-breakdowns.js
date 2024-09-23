import planTypeValueMap from "components/ui/PlanCard/plan-type-map.js";
import { PLAN_TYPE_ENUMS } from "../../../constants";
import SimpleTooltip from "../SimpleTooltip";
import Tooltip from "@mui/material/Tooltip";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const CostBreakdowns = ({ planData, effectiveDate, selectedPharmacyCosts, mailOrderNotApplicable }) => {
    const rows = [];
    const planTypeBreakdowns = planTypeValueMap[PLAN_TYPE_ENUMS[planData.planType]];
    let key = 0;

    for (const i in planTypeBreakdowns) {
        const breakdown = planTypeBreakdowns[i];
        let subtext = breakdown.subtext || "";
        if (subtext) {
            subtext = subtext.replace(
                "{effectiveDate}",
                `${effectiveDate.toLocaleString("default", {
                    month: "long",
                })} ${effectiveDate.getFullYear()} `,
            );
        }
        let value = planData[breakdown.field];
        let errorText = "";
        let errorDescription = "";
        if (breakdown.key) {
            value = selectedPharmacyCosts[breakdown.key];
        } else if (breakdown.function) {
            value = breakdown.function(planData, effectiveDate);
        }

        if (breakdown.conditionalValue) {
            value = breakdown.conditionalValue(planData, mailOrderNotApplicable)["value"];
            errorText = breakdown.conditionalValue(planData, mailOrderNotApplicable)["errorText"];
            errorDescription = breakdown.conditionalValue(planData, mailOrderNotApplicable)["errorDescription"];
        }
        rows.push(
            <div className={"cost-row"} key={key++}>
                <div>
                    <div className={"label"}>
                        {breakdown.label}
                        <div className={"subtext"}>{subtext}</div>
                    </div>
                    <div className={"currency"}>
                        {value === "N/A" ? "N/A" : currencyFormatter.format(value)}
                        {errorText && (
                            <div className={"error-text"}>
                                <Tooltip title={errorDescription} arrow>
                                    <span>{errorText}</span>
                                </Tooltip>
                            </div>
                        )}
                    </div>{" "}
                </div>
            </div>,
        );
    }
    return rows;
};

export default CostBreakdowns;
