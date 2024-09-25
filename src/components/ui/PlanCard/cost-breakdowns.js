import planTypeValueMap from "components/ui/PlanCard/plan-type-map.js";
import { PLAN_TYPE_ENUMS } from "../../../constants";
import SimpleTooltip from "../SimpleTooltip";
import Tooltip from "@mui/material/Tooltip";
import { usePharmacyContext } from "providers/PharmacyProvider";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const CostBreakdowns = ({ planData, effectiveDate, selectedPharmacyCosts, mailOrderNotApplicable }) => {
    const { selectedPharmacy } = usePharmacyContext();
    const rows = [];
    const planTypeBreakdowns = planTypeValueMap[PLAN_TYPE_ENUMS[planData.planType]];
    let key = 0;

    for (const i in planTypeBreakdowns) {
        const breakdown = planTypeBreakdowns[i];
        let subtext = breakdown.subtext || "";
        if (subtext) {
            subtext = subtext.replace(
                "{effectiveDate}",
                `${new Date(effectiveDate).toLocaleString("default", {
                    month: "long",
                })} ${new Date(effectiveDate).getFullYear()} `,
            );
        }
        let value = planData[breakdown.field];
        let errorText = "";
        let errorDescription = "";
        if (breakdown.key) {
            value = selectedPharmacyCosts ? selectedPharmacyCosts[breakdown.key] : "N/A";
        } else if (breakdown.function) {
            value = breakdown.function(planData, effectiveDate);
        }

        if (breakdown.conditionalValue) {
            const conditionalValue = breakdown.conditionalValue(planData, selectedPharmacy, mailOrderNotApplicable);
            value = conditionalValue ? conditionalValue["value"] : "N/A";
            errorText = conditionalValue ? conditionalValue["errorText"] : "";
            errorDescription = conditionalValue ? conditionalValue["errorDescription"] : "";
        }

        // Ensure value is a number before formatting
        const formattedValue = isNaN(value) ? "N/A" : currencyFormatter.format(value);

        rows.push(
            <div className={"cost-row"} key={key++}>
                <div>
                    <div className={"label"}>
                        {breakdown.label}
                        <div className={"subtext"}>{subtext}</div>
                    </div>
                    <div className={"currency"}>
                        {formattedValue}
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
