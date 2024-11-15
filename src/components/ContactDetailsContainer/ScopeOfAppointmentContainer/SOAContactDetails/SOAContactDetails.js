import PropTypes from "prop-types";
import {
    ADDRESS_LINE,
    BENEFICIARY_SUBMITTED,
    BENEFICIARY_FNAME,
    BENEFICIARY_LNAME,
    BENEFICIARY_MIDDLE_INITIAL,
    PHONE,
    SOA_CONSENT_INFO,
    AUTHORIZED_REPRESENTATIVE_FNAME,
    AUTHORIZED_REPRESENTATIVE_MIDDLE_INITIAL,
    AUTHORIZED_REPRESENTATIVE_LNAME,
} from "../ScopeOfAppointmentContainer.constants";
import styles from "./SOAContactDetails.module.scss";
import { Checked } from "../Icons";
import { getLocalDateTime } from "utils/dates";

export const SOAContactDetails = ({ leadSection }) => {
    const {
        firstName = "",
        middleName = "-",
        lastName = "",
        address1 = "",
        phone = "",
    } = leadSection?.beneficiary || {};
    const {
        firstName: auth_firstName = "",
        middleName: auth_middleName = "_",
        lastName: auth_lastName = "",
        address1: auth_address1 = "",
        phone: auth_phone = "",
    } = leadSection?.authorizedRepresentative || {};

    return (
        <div className={styles.formWrapper}>
            <Field label={BENEFICIARY_FNAME} content={firstName} />
            <Field label={BENEFICIARY_MIDDLE_INITIAL} content={middleName} />
            <Field label={BENEFICIARY_LNAME} content={lastName} />
            <Field label={ADDRESS_LINE} content={address1} />
            <Field label={PHONE} content={phone} />

            {leadSection?.hasAuthorizedRepresentative && (
                <>
                    <Field label={AUTHORIZED_REPRESENTATIVE_FNAME} content={auth_firstName} />
                    <Field label={AUTHORIZED_REPRESENTATIVE_MIDDLE_INITIAL} content={auth_middleName} />
                    <Field label={AUTHORIZED_REPRESENTATIVE_LNAME} content={auth_lastName} />
                    <Field label={ADDRESS_LINE} content={auth_address1} />
                    <Field label={PHONE} content={auth_phone} />
                </>
            )}
            <div className={styles.consentWrapper}>
                <span>
                    <Checked />
                </span>
                <span>{SOA_CONSENT_INFO}</span>
            </div>
            <div>
                <div>{BENEFICIARY_SUBMITTED}</div>
                <div className={styles.fieldLabel}>{`${getLocalDateTime(leadSection?.submittedDateTime)?.date} ${
                    getLocalDateTime(leadSection?.submittedDateTime)?.time
                }`}</div>
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

Field.propTypes = {
    label: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

SOAContactDetails.propTypes = {
    leadSection: PropTypes.shape({
        beneficiary: PropTypes.shape({
            firstName: PropTypes.string,
            middleName: PropTypes.string,
            lastName: PropTypes.string,
            address1: PropTypes.string,
            phone: PropTypes.string,
        }),
        authorizedRepresentative: PropTypes.shape({
            firstName: PropTypes.string,
            middleName: PropTypes.string,
            lastName: PropTypes.string,
            address1: PropTypes.string,
            phone: PropTypes.string,
        }),
        hasAuthorizedRepresentative: PropTypes.bool,
        submittedDateTime: PropTypes.string,
    }).isRequired,
};
