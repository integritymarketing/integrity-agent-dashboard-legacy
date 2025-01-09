import * as yup from "yup";

export const getBirthDateSchema = () =>
    yup.object({
        birthdate: yup
            .string()
            .nullable()
            .transform((value) => (value === "" ? null : value))
            .test("is-valid-date", "Date of Birth must be in MM/dd/yyyy format", (value) => {
                if (!value) {
                    return true;
                }
                return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
            }),
    });
