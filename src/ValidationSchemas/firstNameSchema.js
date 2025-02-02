import * as yup from "yup";

export const getFirstNameSchema = () =>
    yup.object({
        firstName: yup
            .string("Enter your first name")
            .required("First name is required")
            .min(
                2,
                "First name must be 2 characters or more accept alpha numerics, space, apostrophe('), hyphen(-), no special characters such as ! @ . , ; : \" ?",
            )
            .max(50, "First name must be 50 characters or less")
            .matches(
                /^[A-Za-z0-9- ']+$/,
                "First name must contain only alpha numerics, space, apostrophe('), hyphen(-), no special characters such as ! @ . , ; : \" ?",
            ),
    });
