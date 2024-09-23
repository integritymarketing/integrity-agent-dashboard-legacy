import { calculatePartialYearDrugCost } from "./calculatePartialDrugCost";

const planTypeMap = {
    MAPD: [
        {
            label: "Medical Deductible",
            field: "medicalDeductible",
        },
        {
            label: "Out of Pocket Health Max",
            field: "maximumOutOfPocketCost",
        },
        {
            label: "Rx Drug Deductible",
            field: "drugDeductible",
            conditionalValue: (planData, condition) => {
                if (condition) {
                    return {value: "N/A", errorText: "Mail Order Not Available", errorDescription: "Mail Order not available with this plan. Please select or add a pharmacy."};
                }
                return {value: planData.drugDeductible, errorText: "", errorDescription: ""};
            },
        },
        {
            label: "Estimated Yearly Rx Drug Cost",
            subtext: "Based on {effectiveDate} Effective Date",
            field: "estimatedAnnualDrugCostPartialYear",
            key: "estimatedYearlyRxDrugCost",
            function: (planData, effectiveDate) => calculatePartialYearDrugCost(planData?.estimatedAnnualDrugCostPartialYear, planData?.drugPremium, effectiveDate),
        },
        {
            label: "Estimated Yearly Total Cost",
            subtext: "Based on {effectiveDate} Effective Date",
            field: "estimatedAnnualDrugCostPartialYear",
            key: "estimatedYearlyTotalCost",
            function: (planData, effectiveDate) =>
                planData.estimatedAnnualDrugCostPartialYear + planData.medicalPremium * (12 - effectiveDate.getMonth()),
            conditionalValue: (planData, condition) => {
                if (condition) {
                    return {value: "N/A", errorText: "Mail Order Not Available", errorDescription: "Mail Order not available with this plan. Please select or add a pharmacy."};
                }
                return {value: planData.estimatedAnnualDrugCostPartialYear, errorText: "", errorDescription: ""};
            },
        },
    ],
    MA: [
        {
            label: "Medical Deductible",
            field: "medicalDeductible",
        },
        {
            label: "Out of Pocket Health Max",
            field: "maximumOutOfPocketCost",
        },
        {
            label: "Estimated Yearly Total Cost",
            field: "estimatedAnnualDrugCostPartialYear",
            subtext: "Based on {effectiveDate} Effective Date",
            key: "estimatedYearlyTotalCost",
            function: (planData, effectiveDate) => planData.medicalPremium * (12 - effectiveDate.getMonth()),
        },
    ],
    PDP: [
        {
            label: "Rx Drug Deductible",
            field: "drugDeductible",
        },
        {
            label: "Estimated Yearly Rx Drug Cost",
            subtext: "Based on {effectiveDate} Effective Date",
            field: "estimatedAnnualDrugCostPartialYear",
            key: "estimatedYearlyRxDrugCost",
            function: (planData, effectiveDate) => calculatePartialYearDrugCost(planData?.estimatedAnnualDrugCostPartialYear, planData?.drugPremium, effectiveDate),
        },
        {
            label: "Estimated Yearly Total Cost",
            subtext: "Based on {effectiveDate} Effective Date",
            field: "estimatedAnnualDrugCostPartialYear",
            key: "estimatedYearlyTotalCost",
            function: (planData, effectiveDate) =>
                planData.estimatedAnnualDrugCostPartialYear + planData.medicalPremium * (12 - effectiveDate.getMonth()),
        },
    ],
};

export default planTypeMap;