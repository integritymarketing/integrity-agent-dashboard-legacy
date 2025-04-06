import * as yup from 'yup';

export const FinalExpenseIntakeFormMobileStep0 = yup
  .object()
  .shape({
    stateCode: yup.string().required('State is required'),

    gender: yup.string().required('Gender is required'),

    dateOfBirth: yup
      .date()
      .nullable()
      .typeError('Date of Birth must be a valid date'),

    age: yup
      .number()
      .nullable()
      .typeError('Age must be a number')
      .min(0, 'Minimum value for age is 0'),
  })
  .test(
    'age-or-dob-required',
    'Either Date of Birth or Age is required',
    function (value) {
      const { dateOfBirth, age } = value || {};
      return !!dateOfBirth || !!age || age === 0; // age can be 0, so explicitly check
    }
  );

export const FinalExpenseIntakeFormMobileStep1 = yup.object().shape({
  isTobaccoUser: yup.string().required('Tobacco use information is required'),
  feet: yup
    .number()
    .nullable()
    .typeError('Feet must be a number')
    .min(0, 'Minimum value for feet is 0')
    .max(9, 'Maximum value for feet is 9'),
  inches: yup
    .number()
    .nullable()
    .typeError('Inches must be a number')
    .min(0, 'Minimum value for inches is 0')
    .max(11, 'Maximum value for inches is 11'),
  weight: yup
    .number()
    .nullable()
    .typeError('Weight must be a number')
    .min(0, 'Minimum value for weight is 0')
    .max(998, 'Maximum value for weight is 998'),
});

export const FinalExpenseIntakeForm = yup.object().shape({
  ...FinalExpenseIntakeFormMobileStep0.fields,
  ...FinalExpenseIntakeFormMobileStep1.fields,
});
