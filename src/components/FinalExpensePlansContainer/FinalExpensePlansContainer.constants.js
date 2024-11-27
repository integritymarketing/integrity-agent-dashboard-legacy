import { AGENTS_API_VERSION } from "services/clientsService";

export const AGENT_SERVICE_NON_RTS = `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentsSelfService/isLifeNonRTS/`;
export const ENROLLEMENT_SERVICE = `${process.env.REACT_APP_ENROLLMENT_SERVICE_API}/FinalExpense/lead/`;
export const BACK = "Back";
export const CONTACT_DETAILS = "Final Expense";
export const SIMPLIFIED_IUL_TITLE = "Simplified IUL";
export const CONTACT_FORM_TITLE = "Let's confirm a few details";
export const CONTACT_FORM_SUBTITLE = "Just a few quick and easy questions to get your quote";
export const CONTACT_FORM_SUBTITLE_MOBILE = "Just a few questions on client's health details.";
export const REQUIRED_FIELDS = "*Required fields";
export const NEXT = "Next";
export const SAVING = "Saving...";
export const GENDER = "Gender";
export const STATE = "State";
export const BIRTHDATE = "Date of Birth";
export const AGE = "Age";
export const HEIGHT = "Height";
export const WEIGHT = "Weight";
export const WT_UNIT = "lbs";
export const WT_PLACEHOLDER = "Weight in pounds";
export const FEET_PLACEHOLDER = "ft";
export const INCH_PLACEHOLDER = "in";
export const SMOKER = "Smoker";
export const TOBACCO_USE = "Tobacco Use";
export const GENDER_OPTS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
];
export const SMOKER_OPTS = [
    { label: "Yes", value: true },
    { label: "No", value: false },
];
export const COVERAGE_TYPE = "Coverage Type: ";
export const COVERAGE_AMOUNT = "Coverage Amount";
export const MONTHLY_PREMIUM = "Monthly Premium";
export const POLICY_FEE = "Policy Fee";
export const PLAN_INFO = "Product Information";
export const APPLY = "Apply";
export const UPDATE_SELLING_PERMISSIONS_TEXT = "Update Your Selling Permissions";
export const UPDATE_SELLING_PERMISSIONS_SUBTEXT = "Update your Selling Permissions for an Improved Experience";
export const BENEFITS_SELLING_PERMISSIONS = [
    "Filter the Quote results by the Products and Carriers you are contracted with",
    "Gain Single Sign On to select Carriers and Product Websites",
    "Automatically link Policies to your Account",
];
export const CONTINUE_QUOTE = "Continue to Quote";
export const UPDATE_PERMISSIONS = "Update my Permissions";
export const FETCH_PLANS_ERROR = "No Final Expense products available. Review the selected filters and retry.";
export const NO_PLANS_ERROR = "Final Expense data is temporarily unavailable. Please try again later.";
export const COVERAGE_TYPE_FINALOPTION = ["LEVEL", "GRADED_MODIFIED", "GUARANTEED"];