import * as yup from "yup";

export const getTextFieldSchema = (fieldName, label) =>
    yup.object({
        [fieldName]: yup
            .string(`Enter ${label}`)
            .required(`${label} is required`)
            .min(
                2,
                `${label} must be 2+ characters in length. Valid characters include A-Z. Space, hyphen, and apostrophe are the only special characters accepted.`,
            )
            .max(50, `${label} must be 50 characters or less`)
            .matches(
                /^[A-Za-z- '`‘’]+$/,
                `${label} must be 2+ characters in length. Valid characters include A-Z. Space, hyphen, and apostrophe are the only special characters accepted.`,
            ),
    });
