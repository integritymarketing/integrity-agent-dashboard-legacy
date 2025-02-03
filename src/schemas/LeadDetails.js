import * as yup from "yup";
import { getFirstNameSchema, getLastNameSchema } from "../ValidationSchemas";
import { getPhoneSchema } from "../ValidationSchemas/phoneSchema";
import { getEmailSchema } from "../ValidationSchemas/emailSchema";

export const LeadDetails = yup
    .object()
    .concat(getFirstNameSchema())
    .concat(getLastNameSchema())
    .concat(getPhoneSchema())
    .concat(getEmailSchema())
    .test("email-or-phone", "Either email or phone number is required", function (values) {
        const { email, phone } = values;
        return Boolean(email) || Boolean(phone);
    });
