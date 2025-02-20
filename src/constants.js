export const SORT_OPTIONS = [
    {
        value: "Reminders.ReminderDate:asc",
        label: "Reminders: Upcoming",
    },
    { value: "createDate:desc", label: "Date Added: Newest to Oldest" },
    { value: "createDate:asc", label: "Date Added: Oldest to Newest" },
    { value: "lastName:asc", label: "Last Name: A to Z" },
    { value: "lastName:desc", label: "Last Name: Z to A" },
];

export const PLAN_SORT_OPTIONS = {
    "premium-asc": {
        label: "Premium Lowest to Highest",
        sort: (res1, res2) => res1.annualPlanPremium - res2.annualPlanPremium,
    },
    "premium-desc": {
        label: "Premium Highest to Lowest",
        sort: (res1, res2) => res2.annualPlanPremium - res1.annualPlanPremium,
    },
    "rating-desc": {
        label: "Highest Star Rating",
        sort: (res1, res2) => res2.planRating - res1.planRating,
    },
    "total-asc": {
        label: " Lowest Total Estimated Cost",
        sort: (res1, res2) =>
            res1.estimatedCostCalculationRx.estimatedYearlyTotalCost -
            res2.estimatedCostCalculationRx.estimatedYearlyTotalCost,
    },
    "drugs-asc": {
        label: "Lowest Estimated Drug Cost",
        sort: (res1, res2) =>
            res1.estimatedCostCalculationRx.estimatedYearlyRxDrugCost -
            res2.estimatedCostCalculationRx.estimatedYearlyRxDrugCost,
    },
    "pocket-asc": {
        label: "Lowest Out of Pocket Max",
        sort: (res1, res2) => res1.maximumOutOfPocketCost - res2.maximumOutOfPocketCost,
    },
};

export const DASHBOARD_SORT_OPTIONS = [
    { label: "Current Year to Date", value: 0 },
    { label: "Last Week", value: 1 },
    { label: "Last Month", value: 2 },
    { label: "Last Year", value: 3 },
    { label: "All Time", value: 4 },
];

export const PLAN_TYPE_ENUMS = {
    1: "PDP",
    2: "MAPD",
    4: "MA",
};

export const MA = "Medicare Advantage ";
export const MAPD = "Medicare Advantage Prescription Drug ";
export const PDP = "Prescription Drug";

export const STATES_OPTIONS = [
    { label: "AL", value: "AL" },
    { label: "AK", value: "AK" },
    { label: "AZ", value: "AZ" },
    { label: "AR", value: "AR" },
    { label: "CA", value: "CA" },
    { label: "CO", value: "CO" },
    { label: "CT", value: "CT" },
    { label: "DE", value: "DE" },
    { label: "FL", value: "FL" },
    { label: "GA", value: "GA" },
    { label: "HI", value: "HI" },
    { label: "ID", value: "ID" },
    { label: "IL", value: "IL" },
    { label: "IN", value: "IN" },
    { label: "IA", value: "IA" },
    { label: "KS", value: "KS" },
    { label: "KY", value: "KY" },
    { label: "LA", value: "LA" },
    { label: "ME", value: "ME" },
    { label: "MD", value: "MD" },
    { label: "MA", value: "MA" },
    { label: "MI", value: "MI" },
    { label: "MN", value: "MN" },
    { label: "MS", value: "MS" },
    { label: "MO", value: "MO" },
    { label: "MT", value: "MT" },
    { label: "NE", value: "NE" },
    { label: "NV", value: "NV" },
    { label: "NH", value: "NH" },
    { label: "NJ", value: "NJ" },
    { label: "NM", value: "NM" },
    { label: "NY", value: "NY" },
    { label: "NC", value: "NC" },
    { label: "ND", value: "ND" },
    { label: "OH", value: "OH" },
    { label: "OK", value: "OK" },
    { label: "OR", value: "OR" },
    { label: "PA", value: "PA" },
    { label: "RI", value: "RI" },
    { label: "SC", value: "SC" },
    { label: "SD", value: "SD" },
    { label: "TN", value: "TN" },
    { label: "TX", value: "TX" },
    { label: "UT", value: "UT" },
    { label: "VT", value: "VT" },
    { label: "VA", value: "VA" },
    { label: "WA", value: "WA" },
    { label: "WV", value: "WV" },
    { label: "WI", value: "WI" },
    { label: "WY", value: "WY" },
];