import * as yup from "yup";

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
            /^[A-Za-z]+$/,
            "First name must be 2+ characters in length. Valid characters include A-Z, and no special characters are accepted."
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
            /^[A-Za-z]+$/,
            "Last name must be 2+ characters in length. Valid characters include A-Z, and no special characters are accepted."
        ),
    email: yup
        .string()
        .email("Email must be a valid address")
        .when("phone", {
            is: (phone) => !phone || phone.length === 0,
            then: yup.string().required("Email is required if Phone is not provided"),
            otherwise: yup.string(),
        }),
    phone: yup
        .string()
        .matches(/^\d{10}$/, "Phone number must be a valid 10-digit number")
        .when("email", {
            is: (email) => !email || email.length === 0,
            then: yup.string().required("Phone number is required if Email is not provided"),
            otherwise: yup.string(),
        }),
});
