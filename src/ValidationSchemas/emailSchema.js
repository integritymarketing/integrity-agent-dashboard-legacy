import * as yup from 'yup';

export const getEmailSchema = () => (
  yup.object({
    email: yup.string("Enter your email")
      .required("Email is required")
      .email("Email address must be a valid address")
  })
)