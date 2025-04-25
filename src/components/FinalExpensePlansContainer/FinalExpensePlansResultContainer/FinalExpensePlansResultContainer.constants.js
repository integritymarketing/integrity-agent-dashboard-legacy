export const STEPPER_FILTER = {
    "Coverage Amount": { step: 5000, min: 1000, max: 999999, value: "face" },
    "Monthly Premium": { step: 20, min: 10, max: 999, value: "premium" },
};
export const STEPPER_FILTER_SIMPLIFIED_IUL = {
    "Coverage Amount": { step: 5000, min: 25000, max: 450000, value: "face" },
    "Monthly Premium": { step: 20, min: 10, max: 4000, value: "premium" },
};
export const DEFAULT_COVERAGE_AMOUNT = 15000;
export const DEFAULT_COVERAGE_AMOUNT_SIMPLIFIED_IUL = 50000;
export const DEFAULT_MONTHLY_PREMIUM = 40;
export const DEFAULT_MONTHLY_PREMIUM_SIMPLIFIED_IUL = 50;
export const COVERAGE_TYPE = [
    { label: "Level", value: "LEVEL" },
    { label: "Graded/Modified", value: "GRADED_MODIFIED" },
    { label: "Guaranteed Issue", value: "GUARANTEED" },
    { label: "Limited Pay", value: "LIMITED" },
    {
        label: "Best Available",
        value: "Best Available",
    },
];

export const PLAN_OPTIONS_HEADING = "Quote Options";
export const COVERAGE_TYPE_HEADING = "Coverage Type";
export const MY_APPOINTED_LABEL = "My Appointed Products";
export const EXCLUDE_LABEL = "Only Excluded Products";
export const ALTERNATIVE_PRODUCTS_LABEL = "Only Alternative Products";

export const COVERAGE_AMT_VALIDATION = "Coverage amount must be between $1,000 and $999,999.";
export const COVERAGE_AMT_VALIDATION_SIMPLIFIED_IUL = "Coverage amount must be between $25,000 and $450,000.";
export const MONTHLY_PREMIUM_VALIDATION = "Monthly premium must be between $10 and $999.";
export const MONTHLY_PREMIUM_VALIDATION_SIMPLIFIED_IUL = "Monthly premium must be between $10 and $4000.";
export const PRESCREEN_AVAILABLE = "Prescreen Available";
export const ELIGIBILTY_NOTES = "Eligibility Notes";
export const PRESCREEN_AVAILABLE_NOTES = "The applicant may be eligible for coverage based on identified conditions.";
export const PRESCREEN_NOTES = "The applicant may not be eligible for coverage due to:";
export const PRESCREEN_NOT_AVAILABLE_NOTES = "We are unable to prescreen eligibility for this product.";
export const PRODUCER_ID_NOT_APPPOINTED = "Producer ID Not Appointed";
export const PRODUCER_NOT_APPOINTED_DESC =
    "The carrier was not able to validate your appointment status for this product. Please contact your upline to validate contract or appointment status with this carrier.";
export const CARRIER_SITE_UNAVAILABLE = "Carrier Site Unavailable";
export const CARRIER_SITE_UNAVAILABLE_DESC =
    "Integrity is unable to connect to the carrier at this time. Please try again later, or visit the carrier’s website directly.";
export const VIEW_SELLING_PERMISSIONS = "View Selling Permissions";
export const AGENT_NOT_CONTRACTED_ERROR = "Agent not contracted for selected product";
