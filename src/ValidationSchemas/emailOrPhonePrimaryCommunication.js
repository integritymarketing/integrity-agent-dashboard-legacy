import * as yup from "yup";

// Email validation schema with regex pattern
const emailSchema = yup
    .string()
    .required("Email address is required")
    .email("Email Address must be valid")
    .test("is-complete", "Incomplete email address", (email) => {
        if (!email) {
            return null;
        }
        const emailPattern = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;
        return emailPattern.test(email);
    });

export const getEmailOrPhonePrimaryCommunicationSchema = () =>
    yup.object({
        primaryCommunication: yup.string().required("Primary Communication is required"),
        phones: yup.object({
            leadPhone: yup
                .string()
                .nullable()
                .when("$primaryCommunication", (primaryCommunication, schema) => {
                    if (primaryCommunication?.length >= 1 && primaryCommunication[0] === "phone") {
                        return schema
                            .required("Phone Number is required")
                            .test("is-valid-phone", "Phone number must be a valid 10-digit phone number", (value) => {
                                if (!value) {
                                    return false;
                                }
                                const cleaned = `${value}`.replace(/\D/g, "");
                                return cleaned.length === 10;
                            });
                    }
                    return schema.nullable();
                }),
        }),
        email: yup
            .string()
            .nullable()
            .when("$primaryCommunication", (primaryCommunication, schema) => {
                if (primaryCommunication?.length >= 1 && primaryCommunication[0] === "email") {
                    return emailSchema;
                }
                return schema.nullable();
            }),
    });