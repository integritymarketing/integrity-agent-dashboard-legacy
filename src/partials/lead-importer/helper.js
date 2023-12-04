import { formatPhoneNumber } from "utils/phones";

export const getFormattedData = ({ phone, isTobaccoUser, height, weight, ...data }) => {
    const formattedData = {
        ...data,
        // middleName: "string",
        // leadSource: "string",
        // leadSourceName: "string",
        // guid: "string",
        phone: String(formatPhoneNumber(phone)).replace(/\D/g, ""),
        ...(isTobaccoUser !== null && isTobaccoUser !== undefined
            ? { isTobaccoUser: isTobaccoUser.toLowerCase() === "yes" }
            : {}),
        ...(height !== null && height !== undefined ? { height: Number(height) } : {}),
        ...(weight !== null && weight !== undefined ? { weight: Number(weight) } : {}),
    };

    return formattedData;
};
