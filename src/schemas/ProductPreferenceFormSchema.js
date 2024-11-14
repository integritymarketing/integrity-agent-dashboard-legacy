import * as yup from "yup";

// Validation schema using Yup
export const ProductPreferenceFormSchema = yup.object().shape({
    payPeriods: yup.string().required("Pay Period is required"),
    loanType: yup.string().required("Loans required"),
    illustratedRate: yup.string().required("Illustrated Rate is required"),
    healthClasses: yup.string().required("Health Classification is required"),
    faceAmounts: yup
        .number()
        .nullable()
        .typeError("Fixed Annual Premium must be a number")
        .min(2000, "Minimum value for Fixed Annual Premium is 2000")
        .max(2000000, "Maximum value for Fixed Annual Premium is 2000000"),
});
