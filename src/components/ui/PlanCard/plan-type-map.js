export default {
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
      label: "Estimated Rx Drug Deductible",
      subtext: "Based on {effectiveDate} Effective Date",
      field: "estimatedAnnualDrugCostPartialYear",
    },
    {
      label: "Estimated Total Cost",
      subtext: "Based on {effectiveDate} Effective Date",
      field: "estimatedAnnualDrugCostPartialYear",
      function: (planData, effectiveDate) =>
        (planData.annualPlanPremium / 12) * (12 - effectiveDate.getMonth()) +
        planData.estimatedAnnualDrugCostPartialYear,
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
      label: "Estimated Total Cost",
      field: "estimatedAnnualDrugCostPartialYear",
      subtext: "Based on {effectiveDate} Effective Date",
      function: (planData, effectiveDate) =>
        (planData.annualPlanPremium / 12) * (12 - effectiveDate.getMonth()),
    },
  ],
  PDP: [
    {
      label: "Rx Drug Deductible",
      field: "drugDeductible",
    },
    {
      label: "Estimated Rx Drug Deductible",
      subtext: "Based on {effectiveDate} Effective Date",
      field: "estimatedAnnualDrugCostPartialYear",
    },
    {
      label: "Estimated Total Cost",
      subtext: "Based on {effectiveDate} Effective Date",
      field: "estimatedAnnualDrugCostPartialYear",
    },
  ],
};
