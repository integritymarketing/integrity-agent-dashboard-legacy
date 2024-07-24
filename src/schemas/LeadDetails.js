import * as yup from "yup";

// Validation schema using Yup
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
    email: yup.string().required("Email is required").email("Email must be a valid address"),
    phone: yup
        .string()
        .required("Phone number is required")
        .matches(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
});
