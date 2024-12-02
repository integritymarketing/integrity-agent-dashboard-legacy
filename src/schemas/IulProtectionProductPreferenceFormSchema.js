import * as yup from "yup";

// Validation schema using Yup
export const IulProtectionProductPreferenceFormSchema = yup.object().shape({
    payPeriods: yup.string().required("Product Solves is required"),
    solves: yup.string().required("Loans required"),
    illustratedRate: yup.string().required("Illustrated Rate is required"),
    healthClasses: yup.string().required("Health Classification is required"),
    faceAmounts: yup
        .number()
        .required("Please enter a value between 2000 and 2000000.")
        .typeError("Fixed Annual Premium must be a number")
        .test("combined-errors", function (value) {
            const { faceAmounts2, faceAmounts3 } = this.parent; // Access the other field (field2)
            if (!value || !faceAmounts2 || !faceAmounts3) {
                return this.createError({ message: "Death Benefits are required" });
            }
            if (value == faceAmounts2 || value == faceAmounts3 || faceAmounts2 == faceAmounts3) {
                return this.createError({ message: "Death Benefits cannot be duplicate" });
            }
            if (value < 2000 || faceAmounts2 < 2000 || faceAmounts3 < 2000) {
                return this.createError({ message: "Minimum value form Death Benefits is 2000" });
            }
            if (value > 200000) {
                return this.createError({ message: "Maximum value for first Death Benefits is 2,00,000" });
            } else if (faceAmounts2 > 300000) {
                return this.createError({ message: "Maximum value for second Death Benefits is 3,00,000" });
            } else if (faceAmounts3 > 400000) {
                return this.createError({ message: "Maximum value for third Death Benefits is 4,00,000" });
            }
            return true;
        }),
    faceAmounts2: yup.number().required("Please enter a value between 2000 and 2000000."),
    faceAmounts3: yup.number().required("Please enter a value between 2000 and 2000000."),
});
