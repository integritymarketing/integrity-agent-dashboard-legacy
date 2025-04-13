export const CONTACT_FORM_TITLE = "Let's confirm a few details";
export const CONTACT_FORM_SUBTITLE =
  'Just a few quick and easy questions to get your quote';
export const CONTACT_FORM_SUBTITLE_MOBILE =
  "Just a few questions on client's health details.";
export const REQUIRED_FIELDS = '*Required fields';
export const NEXT = 'Next';
export const SAVING = 'Saving...';
export const GENDER = 'Gender';
export const STATE = 'State';
export const BIRTHDATE = 'Date of Birth';
export const AGE = 'Age';
export const HEIGHT = 'Height';
export const WEIGHT = 'Weight';
export const WT_PLACEHOLDER = 'Weight in pounds';
export const FEET_PLACEHOLDER = 'ft';
export const INCH_PLACEHOLDER = 'in';
export const SMOKER = 'Smoker';
export const TOBACCO_USE = 'Tobacco Use';
export const GENDER_OPTS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];
export const SMOKER_OPTS = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];
export const LIFE_FORM_TYPES = {
  IUL_ACCUMULATION: 'IUL_ACCUMULATION',
  IUL_PROTECTION: 'IUL_PROTECTION',
  TERM: 'TERM',
};
export const PAY_PERIOD_OPTS = [
  { label: '10 Pay', value: '10' },
  { label: 'Pay to Age 65', value: '65' },
];
export const LOANS_OPTS = [
  { label: 'Fixed', value: 'LoansFixed' },
  { label: 'Participating', value: 'LoansParticipation' },
];

export const ILLUSTRATED_RATE_OPTS = [
  { label: 'Max', value: '0' },
  { label: '5%', value: '5' },
  { label: '6%', value: '6' },
];

export const HEALTH_CLASSIFICATION_SMOKER_OPTS = [
  { label: 'Preferred', value: 'TP' },
];

export const HEALTH_CLASSIFICATION_NON_SMOKER_OPTS = [
  { label: 'Standard', value: 'S' },
  { label: 'Standard +', value: 'SP' },
  { label: 'Preferred', value: 'P' },
  { label: 'Preferred +', value: 'PP' },
];

export const LIFE_FORM_TITLE = {
  [LIFE_FORM_TYPES.IUL_ACCUMULATION]: {
    HEADER_TITLE: 'IUL Accumulation',
    CARD_TITLE: 'Set your product preferences.',
    CARD_SUB_TITLE: 'Just a few quick and easy questions to get your quote',
  },
  [LIFE_FORM_TYPES.IUL_PROTECTION]: {
    HEADER_TITLE: 'IUL Protection',
    CARD_TITLE: 'Set your product preferences.',
    CARD_SUB_TITLE: 'Just a few quick and easy questions to get your quote',
  },
};

export const IUL_PROTECTION_PAY_PERIOD_OPTS = [
  { label: 'Full Pay', value: '0' },
  { label: 'Single Pay', value: '1' },
  { label: '10 Pay', value: '10' },
];

export const PRODUCT_SOLVES_OPTS = [
  { label: '$1 CSV at age 121', value: '$1CSVAtAge121' },
  { label: 'Endow at age 100*', value: 'EndowAtAge100' },
];

export const IUL_PROTECTION_ILLUSTRATED_RATE_OPTS = [
  { label: 'Max', value: '0' },
  { label: '4%', value: '4' },
  { label: '5%', value: '5' },
  { label: '6%', value: '6' },
];
