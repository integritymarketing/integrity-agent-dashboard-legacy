export const COVERAGE_AMOUNT = "Coverage Amount";
export const MONTHLY_PREMIUM = "Monthly Premium";
export const STEPPER_FILTER = {
  "Coverage Amount": { step: 5000, min: 15000, max: 50000, value: "face" },
  "Monthly Premium": { step: 20, min: 40, max: 500, value: "premium" },
};

export const COVERAGE_TYPE = [
  { label: "Level", value: "level" },
  { label: "Graded", value: "graded" },
  { label: "Guaranteed", value: "guaranteed" },
  { label: "Limited", value: "limited_pay" },
];
export const PAYMENT_METHODS = ["Bank Draft/EFT"];
