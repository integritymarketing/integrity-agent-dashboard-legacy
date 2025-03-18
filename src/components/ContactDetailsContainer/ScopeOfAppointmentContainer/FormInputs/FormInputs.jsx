import React from "react";
import {Form, Formik} from "formik";
import validationService from "services/validationService";
import {
    AGENT_FNAME,
    AGENT_LNAME,
    AGENT_PHONE,
    INITIAL_METHOD_OF_CONTACT,
    SOA_SIGNED_OPTS,
    SOA_SIGNED_AT_APPOINTMENT,
    SOA_EXPLANATION,
    SOA_FORM_CONSENT,
    SUBMIT,
} from "../ScopeOfAppointmentContainer.constants";
import styles from "./FormInputs.module.scss";
import DatePickerMUI from "components/DatePicker";
import TextField from "@mui/material/TextField";
import {FormField} from "components/SharedFormFields/FormField";
import {Checked, Unchecked} from "../Icons";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import dateFnsFormat from "date-fns/format";
import {formatPhoneNumber} from "utils/phones";

const SubmitButton = styled(Button)(() => ({
    color: "#fff",
    borderRadius: "20px",
    background: "#4178ff",
    textTransform: "none",
    fontWeight: "bold",
    boxShadow: "none",
    marginTop: "20px",
}));

export const FormInputs = ({agentSection, saveDetails}) => {
    return (
        <Formik
            initialValues={{
                firstName: agentSection?.firstName,
                lastName: agentSection?.lastName,
                phoneNumber: formatPhoneNumber(agentSection?.phoneNumber, true),
                methodOfContact: "",
                acceptedSOA: false,
                soaSignedDuringAppointment: "",
                appointmentDate: new Date(),
                explanationOfSOASignedDuringAppointment: "",
            }}
            validate={async (values) => {
                return validationService.validateMultiple(
                    [
                        {
                            name: "firstName",
                            validator: validationService.validateName,
                            args: ["First Name"],
                        },
                        {
                            name: "lastName",
                            validator: validationService.validateName,
                            args: ["Last Name"],
                        },
                        {
                            name: "phoneNumber",
                            validator: validationService.validatePhone,
                            args: ["Phone Number"],
                        },
                        {
                            name: "methodOfContact",
                            validator: validationService.validateRequired,
                            args: ["Method of Contact"],
                        },
                    ],
                    values
                );
            }}
            onSubmit={async (values, {setErrors, setSubmitting}) => {
                setSubmitting(true);
                const payload = {
                    ...values,
                    appointmentDate: dateFnsFormat(values.appointmentDate, "MM/dd/yy"),
                    submittedDateTime: new Date().toISOString(),
                };
                saveDetails(payload);
                setSubmitting(false);
            }}
        >
            {({values, errors, touched, isValid, dirty, handleChange, handleBlur, handleSubmit, setFieldValue}) => {
                return (
                    <Form>
                        <FormField
                            label={AGENT_FNAME}
                            name={"firstName"}
                            className={styles.fieldContainer}
                            labelClassName={styles.label}
                            placeholder="First Name"
                            initialValue={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            touched={touched.firstName}
                            required
                        />

                        <FormField
                            label={AGENT_LNAME}
                            name={"lastName"}
                            className={styles.fieldContainer}
                            labelClassName={styles.label}
                            placeholder="Last Name"
                            initialValue={values.lastName}
                            touched={touched.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />

                        <FormField
                            label={AGENT_PHONE}
                            name={"phoneNumber"}
                            className={styles.fieldContainer}
                            labelClassName={styles.label}
                            placeholder="Phone Number"
                            touched={touched.phoneNumber}
                            initialValue={values.phoneNumber}
                            onChange={handleChange}
                        />

                        <FormField
                            label={INITIAL_METHOD_OF_CONTACT}
                            name={"methodOfContact"}
                            className={styles.fieldContainer}
                            labelClassName={styles.label}
                            placeholder="Method of Contact"
                            initialValue={values.methodOfContact}
                            onChange={handleChange}
                            touched={touched.methodOfContact}
                        />

                        <Box marginTop="10px" className={styles.signedText}>
                            {SOA_SIGNED_AT_APPOINTMENT}
                            {SOA_SIGNED_OPTS.map((option, index) => {
                                const isChecked = values.soaSignedDuringAppointment === option;
                                return (
                                    <div
                                        key={index}
                                        className={`${styles.soaSignedTime} ${isChecked ? styles.checked : ""}`}
                                        onClick={() => {
                                            setFieldValue("soaSignedDuringAppointment", option);
                                        }}
                                    >
                                        <span>{isChecked ? <Checked/> : <Unchecked/>}</span>
                                        <span>{option}</span>
                                    </div>
                                );
                            })}
                            {values.soaSignedDuringAppointment === "Yes" && (
                                <>
                                    <div className={styles.signedText}>{SOA_EXPLANATION}</div>
                                    <TextField
                                        id="outlined-basic"
                                        placeholder=""
                                        name="explanationOfSOASignedDuringAppointment"
                                        variant="outlined"
                                        value={values.explanationOfSOASignedDuringAppointment}
                                        onChange={handleChange}
                                        multiline
                                        rows={2}
                                        className={styles.explanationInput}
                                    />
                                </>
                            )}
                        </Box>

                        <Box marginTop="10px">
                            <h4 className={styles.formText}>Date Appointment Completed</h4>

                            <DatePickerMUI
                                value={values.appointmentDate}
                                disableFuture={true}
                                onChange={(date) => {
                                    setFieldValue("appointmentDate", date);
                                }}
                            />
                        </Box>
                        <Box marginTop="10px">
                            <div
                                className={styles.consentWrapper}
                                onClick={() => {
                                    setFieldValue("acceptedSOA", !values.acceptedSOA);
                                }}
                            >
                                <span>{values.acceptedSOA ? <Checked/> : <Unchecked strokeColor="#DDDDDD"/>}</span>
                                <span>{SOA_FORM_CONSENT}</span>
                            </div>
                        </Box>
                        <SubmitButton
                            disabled={!dirty || !isValid || !values.acceptedSOA || !values.soaSignedDuringAppointment}
                            variant="contained"
                            onClick={handleSubmit}
                            endIcon={<ButtonCircleArrow/>}
                        >
                            {SUBMIT}
                        </SubmitButton>
                    </Form>
                );
            }}
        </Formik>
    );
};
