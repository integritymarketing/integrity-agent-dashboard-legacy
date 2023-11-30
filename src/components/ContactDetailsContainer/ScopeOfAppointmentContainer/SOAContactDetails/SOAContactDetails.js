import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    ADDRESS_LINE,
    BENEFICIARY_SUBMITTED,
    BENEFICIARY_FNAME,
    BENEFICIARY_LNAME,
    BENEFICIARY_MIDDLE_INITIAL,
    PHONE,
    SOA_CONSENT_INFO
} from '../ScopeOfAppointmentContainer.constants';
import styles from './SOAContactDetails.module.scss';
import { Checked } from '../Icons';

export const SOAContactDetails = ({ leadSection }) => {
    const { firstName = "", middleName = "-", lastName = "", address1 = "", phone = "", } = leadSection?.beneficiary;
    return (
        <div className={styles.formWrapper}>
            <div className={styles.nameBox}>
                <Field label={BENEFICIARY_FNAME} content={firstName} />
                <Field label={BENEFICIARY_MIDDLE_INITIAL} content={middleName} />
            </div>

            <Field label={BENEFICIARY_LNAME} content={lastName} />
            <Field label={ADDRESS_LINE} content={address1} />
            <Field label={PHONE} content={phone} />
            <div className={styles.consentWrapper} >
                <span>{<Checked />}</span>
                <span>{SOA_CONSENT_INFO}</span>
            </div>
            <div>
                <div>{BENEFICIARY_SUBMITTED}</div>
                <div className={styles.fieldLabel}>{leadSection?.submittedDateTime}</div>
            </div>
        </div>
    );
};

const Field = ({ label, content }) => (
    <div>
        <div className={styles.fieldLabel}>{label}</div>
        <div className={styles.fieldContent}>{content}</div>
    </div>
);

SOAContactDetails.propTypes = {
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    addressLine: PropTypes.string,
    phone: PropTypes.string,
    submittedTimestamp: PropTypes.string
};
