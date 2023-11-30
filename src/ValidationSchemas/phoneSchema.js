import * as yup from 'yup';

export const getPhoneSchema = () => (
  yup.object({
    phoneNumber: yup.string("Enter your phone number")
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
  })
)