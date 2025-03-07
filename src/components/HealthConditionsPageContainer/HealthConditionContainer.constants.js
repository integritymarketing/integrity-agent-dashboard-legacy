import { QUOTES_API_VERSION } from 'services/clientsService';
export const HEALTH_CONDITION_API = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/HealthCondition/Lead/`;
export const DISCLAIMER_TEXT =
  'Underwriting prescreening is not a determination of eligibility. Quote eligibility will be determined by the carrier at time of application.';
export const CARD_TITLE =
  'Add your health conditions using your prescriptions or by searching directly for a condition for coverage eligibility.';
export const ADD_NEW = 'Add New';
export const COMPLETED = 'Completed';
export const INCOMPLETE = 'Incomplete';
export const OUTDATED = 'Outdated';
export const EDIT = 'Edit';
export const HEADER_TITLE = 'Health Conditions';
export const CONDITIONS = 'Conditions';
export const CONTINUE_TO_QUOTE = 'Continue to Quote';
export const MEDICATIONS = 'Medications';
export const SIMPLIFIED_IUL_TITLE = 'Simplified IUL';
export const HEALTH_CONDITION_SEARCH_API = `${import.meta.env.VITE_QUOTE_URL
  }/api/${QUOTES_API_VERSION}/Underwriting/healthcondition/search/HEALTH`;
export const PRESCRIPTION_TOOLTIP =
  'The prescriptions listed were entered from a previous visit. Let us know what condition you take these medications for to get the most accurate quote.';
export const SEARCH_BY_PRESCRIPTION = 'Search for a Condition by Prescription';
export const SEARCH_BY_CONDITION = 'Search for a Condition';
export const UPDATE_CONDITION = 'Update Condition';
export const NO_CONDITIONS = "I currently don’t have any health conditions"