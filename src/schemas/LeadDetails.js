import * as yup from "yup";

const emailOrPhoneRequired = yup.string().test({
    name: "emailOrPhoneRequired",
    message: "Either email or phone number is required.",
    test: function () {
        const { email, phone } = this.parent;
        return email || phone;
    },
});
export const LeadDetails = yup.object().shape({
    firstName: yup
        .string()
        .required(
            "First name must be 2+ characters in length. Valid characters include A-Z, and no special characters are accepted."
        )
        .min(
            2,
            "First name must be 2+ characters in length. Valid characters include A-Z, and no special characters are accepted."
        )
        .matches(
            /^[A-Za-z0-9- ']+$/,
            `${fieldName} must contain only alpha numerics, space, apostrophe('), hyphen(-), no special characters such as ! @ . , ; : " ?`,
        ),
    lastName: yup
        .string()
        .required(
            "Last name must be 2+ characters in length. Valid characters include A-Z, and no special characters are accepted."
        )
        .min(
            2,
            "Last name must be 2+ characters in length. Valid characters include A-Z, and no special characters are accepted."
        )
        .matches(
            /^[A-Za-z0-9- ']+$/,
            `${fieldName} must contain only alpha numerics, space, apostrophe('), hyphen(-), no special characters such as ! @ . , ; : " ?`,
        ),
    email: emailOrPhoneRequired.email("Email must be a valid address"),
    phone: emailOrPhoneRequired.matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone number must be a valid 10 digit number'),
    
});
