import * as yup from "yup";
 
export const getPhoneSchema = () =>
    yup.object({
        phone: yup
            .string("Enter your phone number")
            .required("Phone number is required")
            .test(
                "len",
                "Phone number must be 10 digits",
                (val) => val && val.replace(/\D/g, "").length === 10
            )
            .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone number is not valid"),
    });
