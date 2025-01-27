import * as yup from "yup";

export const getMedicareBeneficiaryIDSchema = () => {
    const mbidRegex =
        /^[1-9][AC-HJ-KM-NP-RT-Y][AC-HJ-KM-NP-RT-Y0-9][0-9][AC-HJ-KM-NP-RT-Y][AC-HJ-KM-NP-RT-Y0-9][0-9][AC-HJ-KM-NP-RT-Y][AC-HJ-KM-NP-RT-Y][0-9][0-9]$/;
    return yup.object({
        medicareBeneficiaryID: yup
            .string()
            .nullable()
            .test("valid-mbi", "Invalid Medicare Number", (val) => {
                if (!val) {
                    return true;
                }
                const formattedId = String(val).toUpperCase().replace(/-/g, "");
                const isValid = mbidRegex.test(formattedId);
                return isValid || val === "";
            }),
    });
};
