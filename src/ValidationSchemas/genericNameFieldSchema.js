import * as yup from "yup";

export const getNameSchema = (fieldName) =>
    yup.object({
        name: yup
            .string(`Enter ${fieldName}`)
            .required(`${fieldName} is required`)
            .min(
                2,
                `${fieldName} must be 2 characters or more accept alpha numerics, space, apostrophe('), hyphen(-), no special characters such as ! @ . , ; : " ?`,
            )
            .max(50, `${fieldName} must be 50 characters or less`)
            .matches(
                /^[A-Za-z0-9- ']+$/,
                `${fieldName} must contain only alpha numerics, space, apostrophe('), hyphen(-), no special characters such as ! @ . , ; : " ?`,
            ),
    });
