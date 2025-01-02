import * as yup from "yup";

export const getPrimaryCommunicationSchema = () =>
    yup.object({
        primaryCommunication: yup.string().required("Primary Communication is required"),
    });
