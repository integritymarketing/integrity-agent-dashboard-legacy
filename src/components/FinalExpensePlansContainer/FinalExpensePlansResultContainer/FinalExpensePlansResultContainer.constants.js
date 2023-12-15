export const STEPPER_FILTER = {
    "Coverage Amount": { step: 5000, min: 5000, max: 50000, value: "face" },
    "Monthly Premium": { step: 20, min: 40, max: 500, value: "premium" },
};
export const DEFAULT_COVERAGE_AMOUNT = 15000;
export const COVERAGE_TYPE = [
    { label: "Level", value: "LEVEL" },
    { label: "Graded/Modified", value: "GRADED_MODIFIED" },
    { label: "Guaranteed", value: "GUARANTEED" },
    { label: "Limited", value: "LIMITED" },
    {
        label: "All Coverage Types",
        value: ["LEVEL", "GRADED_MODIFIED", "LIMITED", "GUARANTEED"],
    },
];

export const PLAN_OPTIONS_HEADING = "Plan Options";
export const COVERAGE_TYPE_HEADING = "Coverage Type";
export const MY_APPOINTED_LABEL = "My Appointed Products";
export const EXCLUDE_LABEL = "Show Excluded Products";
