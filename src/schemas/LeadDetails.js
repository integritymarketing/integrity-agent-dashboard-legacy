import * as yup from 'yup';

const emailOrPhoneRequired = yup.string().test({
  name: 'emailOrPhoneRequired',
  message: 'Either email or phone number is required.',
  test: function () {
    const { email, phone } = this.parent;
    return email || phone;
  },
});
export const LeadDetails = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(
      2,
      `First name must be 2+ characters in length. Valid characters include A-Z. Space, hyphen, and apostrophe are the only special characters accepted.`
    )
    .max(50, `First name must be 50 characters or less`)
    .matches(
      /^[A-Za-z- '`‘’]+$/,
      `First name must be 2+ characters in length. Valid characters include A-Z. Space, hyphen, and apostrophe are the only special characters accepted.`
    ),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(
      2,
      `Last name must be 2+ characters in length. Valid characters include A-Z. Space, hyphen, and apostrophe are the only special characters accepted.`
    )
    .max(50, `Last name must be 50 characters or less`)
    .matches(
      /^[A-Za-z- '`‘’]+$/,
      `Last name must be 2+ characters in length. Valid characters include A-Z. Space, hyphen, and apostrophe are the only special characters accepted.`
    ),
});
