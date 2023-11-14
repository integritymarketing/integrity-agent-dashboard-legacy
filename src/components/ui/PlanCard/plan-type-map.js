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
        },
        {
            label: "Estimated Yearly Rx Drug Cost",
            subtext: "Based on {effectiveDate} Effective Date",
            field: "estimatedAnnualDrugCostPartialYear",
            function: (planData) => planData.estimatedAnnualDrugCostPartialYear - planData.drugPremium * 12,
        },
        {
            label: "Estimated Yearly Total Cost",
            subtext: "Based on {effectiveDate} Effective Date",
            field: "estimatedAnnualDrugCostPartialYear",
            function: (planData, effectiveDate) =>
                planData.estimatedAnnualDrugCostPartialYear + planData.medicalPremium * (12 - effectiveDate.getMonth()),
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
            function: (planData) => planData.estimatedAnnualDrugCostPartialYear - planData.drugPremium * 12,
        },
        {
            label: "Estimated Yearly Total Cost",
            subtext: "Based on {effectiveDate} Effective Date",
            field: "estimatedAnnualDrugCostPartialYear",
            function: (planData, effectiveDate) =>
                planData.estimatedAnnualDrugCostPartialYear + planData.medicalPremium * (12 - effectiveDate.getMonth()),
        },
    ],
};

export default planTypeMap;
