import * as yup from 'yup';

export const getLastNameSchema = () => (
  yup.object({
    lastName: yup.string("Enter your last name")
      .required("Last name is required")
      .min(2, 'Last name must be 2 characters or more and accept alpha numerics, space, apostrophe(\'), hyphen(-). It should not include special characters such as ! @ . , ; : " ?')
      .max(50, 'Last name must be 50 characters or less')
      .matches(/^[A-Za-z0-9- ']+$/, 'Last name must contain only alpha numerics, space, apostrophe(\'), hyphen(-), and no special characters such as ! @ . , ; : " ?')
  })
)
