import * as yup from "yup";

export const getAddressSchema = () => {
    const addressRegex = /^[0-9a-zA-Z #'.,-]{2,}$/;
    return yup.object({
        address: yup.object({
            address1: yup
                .string()
                .matches(
                    addressRegex,
                    "Address must be 2 characters or more. Only Alpha, Numerical, and certain special characters such as # ' . - are allowed",
                ),
            address2: yup
                .string()
                .test(
                    "is-valid-address",
                    "Address must be 2 characters or more. Only Alpha, Numerical, and certain special characters such as # ' . - are allowed",
                    (value) => {
                        if (!value) {
                            return true;
                        }
                        return addressRegex.test(value);
                    },
                ),
            city: yup
                .string()
                .matches(
                    addressRegex,
                    "City must be 2 characters or more. Only Alpha, Numerical, and certain special characters such as # ' . - are allowed",
                ),
        }),
    });
};
