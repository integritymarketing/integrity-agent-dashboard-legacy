import * as yup from 'yup';

export const getZipCodeSchema = () => (
  yup.object({
    zipCode: yup.string("Enter your ZIP code")
      .required("ZIP code is required")
      .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid ZIP code format')
  })
)