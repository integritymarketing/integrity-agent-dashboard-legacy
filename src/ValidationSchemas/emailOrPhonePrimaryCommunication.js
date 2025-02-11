import * as yup from "yup";

// Email validation schema
const emailSchema = yup.string().test("is-valid-email", "Invalid email address", (email, context) => {
    if (!email) {return true;} // Allow empty if not required
    const emailPattern = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;
    return emailPattern.test(email);
});

// Phone validation schema (10-digit required)
const phoneSchema = yup.string().matches(/^\d{10}$/, "Phone number must be a valid 10-digit number");

// Main validation schema
export const getEmailOrPhonePrimaryCommunicationSchema = () =>
    yup.object({
        primaryCommunication: yup
            .string()
            .required("Primary Communication is required")
            .oneOf(["email", "phone"], "Invalid communication method"),

        email: yup.lazy((_, context) => {
            return context?.parent?.primaryCommunication === "email"
                ? emailSchema.required("Email address is required")
                : emailSchema;
        }),

        phones: yup.object().shape({
            leadPhone: yup.lazy((_, context) => {
                return context?.parent?.primaryCommunication === "phone"
                    ? phoneSchema.required("Phone number is required")
                    : phoneSchema;
            }),
        }),
    });