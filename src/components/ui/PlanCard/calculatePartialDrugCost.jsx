export const calculatePartialYearDrugCost = (estimatedAnnualDrugCostPartialYear, drugPremium, effectiveDate) => {
    if (estimatedAnnualDrugCostPartialYear === null || drugPremium === null) {
        return 'N/A';
    }

    const remainingMonths = 12 - effectiveDate.getMonth();
    return estimatedAnnualDrugCostPartialYear - (drugPremium * remainingMonths);
};


export const calculateMonthlyDrugCost = (estimatedAnnualDrugCostPartialYear, drugPremium, effectiveDate) => {
    if (estimatedAnnualDrugCostPartialYear === null || drugPremium === null) {
        return 'N/A';
    }

    const remainingMonths = 12 - effectiveDate.getMonth();
    return estimatedAnnualDrugCostPartialYear / remainingMonths - drugPremium;
};