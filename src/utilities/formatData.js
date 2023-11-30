import { parseDate, formatServerDate } from "utils/dates";

export const getFormattedPhone = (phone) =>
    phone ? ("" + phone).replace(/\D/g, "") : null;

export const getFormattedData = (
    { phone, followUpDate, email, leadStatusId, ...data },
    baseValues = {}
) => {
    return Object.assign({}, baseValues, data, {
        email: email || null,
        phone: getFormattedPhone(phone),
        followUpDate: followUpDate
            ? formatServerDate(parseDate(followUpDate))
            : null,
        leadStatusId: parseInt(leadStatusId, 10),
    });
};