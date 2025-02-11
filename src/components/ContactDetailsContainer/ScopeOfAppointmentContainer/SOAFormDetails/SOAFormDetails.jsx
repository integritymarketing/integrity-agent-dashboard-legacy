import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Checked, Unchecked } from "../Icons";
import {
    AGENT_FNAME,
    AGENT_LNAME,
    AGENT_PHONE,
    AGENT_SUBMITTED,
    APPOINTMENT_DATE_COMPLETED,
    CONFIRMATION_NO,
    INITIAL_METHOD_OF_CONTACT,
    REQUIRED_TEXT,
    SOA_FORM,
    SOA_FORM_CONSENT,
    SOA_FORM_DETAILS,
    SOA_SIGNED_AT_APPOINTMENT,
    SOA_SIGNED_OPTS,
    SOA_EXPLANATION,
} from "../ScopeOfAppointmentContainer.constants";
import { getLocalDateTime } from "utils/dates";

import styles from "./SOAFormDetails.module.scss";

export const SOAFormDetails = ({ agentSection, linkCode }) => {
    const {
        firstName = "",
        lastName = "",
        phoneNumber = "",
        methodOfContact = "",
        submittedDateTime = "",
        appointmentDate = "",
        soaSignedDuringAppointment,
        explanationOfSOASignedDuringAppointment = "",
    } = agentSection;

    return (
        <>
            <div className={styles.title}>{SOA_FORM}</div>
            <div>{SOA_FORM_DETAILS}</div>
            <div className={styles.requiredText}>{REQUIRED_TEXT}</div>

            <Field label={AGENT_FNAME} value={firstName} />
            <Field label={AGENT_LNAME} value={lastName} />
            <Field label={AGENT_PHONE} value={phoneNumber} />
            <Field label={INITIAL_METHOD_OF_CONTACT} value={methodOfContact} />

            <div className={styles.fieldValue}>
                <Field label={SOA_SIGNED_AT_APPOINTMENT} />
            </div>
            {SOA_SIGNED_OPTS.map((option, index) => {
                const checked = soaSignedDuringAppointment ? "Yes" : "No";
                return (
                    <div key={index} className={`${styles.soaSignedTime} ${checked === option ? styles.checked : ""}`}>
                        <span>{checked === option ? <Checked /> : <Unchecked />}</span>
                        <span>{option}</span>
                    </div>
                );
            })}
            {soaSignedDuringAppointment && (
                <Field label={SOA_EXPLANATION} value={explanationOfSOASignedDuringAppointment} />
            )}

            <Field label={APPOINTMENT_DATE_COMPLETED} value={appointmentDate} />

            <div className={styles.consentWrapper}>
                <span>{<Checked />}</span>
                <span>{SOA_FORM_CONSENT}</span>
            </div>

            <Field
                label={AGENT_SUBMITTED}
                value={`${getLocalDateTime(submittedDateTime)?.date} ${getLocalDateTime(submittedDateTime)?.time}`}
                bold
            />
            <Field label={CONFIRMATION_NO} value={linkCode} bold />
        </>
    );
};

const Field = ({ label, value, bold = false }) => (
    <div>
        <div className={`${bold ? "" : styles.fieldLabel}`}>{label}</div>
        <div className={`${bold ? styles.boldText : styles.fieldValue}`}>{value}</div>
    </div>
);

SOAFormDetails.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    initialMethodContact: PropTypes.string,
    appointmentCompletionDate: PropTypes.string,
    agentSubmitted: PropTypes.string,
    confirmationNo: PropTypes.string,
};
