import * as yup from "yup";
import { getPhoneSchema } from "../ValidationSchemas/phoneSchema";
import { getEmailSchema } from "../ValidationSchemas/emailSchema";
import { getTextFieldSchema } from "../ValidationSchemas/genericTextFieldSchema";

export const LeadDetails = yup
    .object()
    .concat(getTextFieldSchema("firstName", "First name"))
    .concat(getTextFieldSchema("lastName", "Last name"))
    .concat(getPhoneSchema())
    .concat(getEmailSchema())
    .test("email-or-phone", "Either email or phone number is required", function (values) {
        const { email, phone } = values;
        return Boolean(email) || Boolean(phone);
    });
