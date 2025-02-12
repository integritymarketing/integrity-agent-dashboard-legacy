import * as yup from 'yup';

export const getEmailSchema = () => (
  yup.object({
    email: yup.string()
      .email("Email address must be a valid address")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email address must be in a valid format"
      )
      .nullable()
  })
);
