import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { SOA_SIGNED_OPTS, SOA_FORM_CONSENT, SOA_FORM_SUBTEXT, SOA_FORM_TEXT, SUBMIT, SOA_SIGNED_AT_APPOINTMENT, SOA_EXPLANATION } from "../ScopeOfAppointmentContainer.constants"
import styles from "./SOAContactDetailsForm.module.scss";
import { useState, useCallback, useEffect } from "react";
import { Checked, Unchecked } from '../Icons';
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import { FormInputs } from '../FormInputs/FormInputs';
import DatePickerMUI from "components/DatePicker";
import TextField from "@mui/material/TextField";
import dateFnsFormat from "date-fns/format";

const SubmitButton = styled(Button)(() => ({
    color: "#4178ff",
    borderRadius: "20px",
    color: "#FFFFFF",
    background: "#4178ff",
    textTransform: "none",
    fontWeight: "bold",
    boxShadow: "none"
}));

const initialValues = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    methodOfContact: "",
};


export const SOAContactDetailsForm = ({ onSubmit, agentSection }) => {
    const [formInputs, setFormInputs] = useState(initialValues);
    const [acceptedSOA, setAcceptedSOA] = useState(false);
    const [soaSignedAtApointment, setSoaSignedAtApointment] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [explanationOfSOASignedDuringAppointment, setExplanationOfSOASignedDuringAppointment] = useState('');


    useEffect(() => {
        if (!agentSection) return;
        setFormInputs({
            firstName: agentSection?.firstName,
            lastName: agentSection?.lastName,
            phoneNumber: agentSection?.phoneNumber,
            methodOfContact: "",
        })
    }, [agentSection])

    const toggleConsent = useCallback(() => {
        setAcceptedSOA(prevState => !prevState);
    }, []);

    const handleSoaSignedSelection = useCallback((option) => {
        setSoaSignedAtApointment(option);
    }, []);

    const handleSubmit = () => {
        const payload = {
            ...formInputs,
            acceptedSOA,
            soaSignedAtApointment,
            appointmentDate: dateFnsFormat(appointmentDate, "MM/dd/yy"),
            submittedDateTime: new Date().toISOString(),
            explanationOfSOASignedDuringAppointment
        }
        onSubmit(payload);
    }


    return (
        <>
            <div className={styles.formWrapper}>
                <div className={styles.formText}>{SOA_FORM_TEXT}</div>
                <div className={styles.formSubText}>{SOA_FORM_SUBTEXT}</div>
                <FormInputs formInputs={formInputs} setFormInputs={setFormInputs} />
                {/* <div className={styles.formAuthText}>{SOA_FORM_AUTH_TEXT}<InfoIcon className={styles.infoStyle} /></div>
                <div className={`${styles.authCheck} ${isAuthAccepted ? styles.checked : ""}`} onClick={() => setIsAuthAccepted(!isAuthAccepted)}>
                    <span>{isAuthAccepted ? <Checked /> : <Unchecked />}</span>
                    <span>{isAuthAccepted ? "Ancillary Products" : "Yes"}</span>
                </div> */}

                <div className={styles.signedText}>{SOA_SIGNED_AT_APPOINTMENT}</div>
                {SOA_SIGNED_OPTS.map((option, index) => {
                    const isChecked = soaSignedAtApointment === option;
                    return (
                        <div
                            key={index}
                            className={`${styles.soaSignedTime} ${isChecked ? styles.checked : ""}`}
                            onClick={() => handleSoaSignedSelection(option)}
                        >
                            <span>{isChecked ? <Checked /> : <Unchecked />}</span>
                            <span>{option}</span>
                        </div>
                    );
                })}
                {soaSignedAtApointment === "Yes" && (
                    <>
                        <div className={styles.signedText}>{SOA_EXPLANATION}</div>
                        <TextField
                            id="outlined-basic"
                            placeholder=""
                            variant="outlined"
                            value={explanationOfSOASignedDuringAppointment}
                            onChange={(e) => setExplanationOfSOASignedDuringAppointment(e.target.value)}
                            multiline
                            rows={2}
                            className={styles.explanationInput}
                        />
                    </>
                )
                }
                <div  >
                    <h4 className={styles.formText}>Date Appointment Completed</h4>

                    <DatePickerMUI
                        value={appointmentDate}
                        disableFuture={true}
                        onChange={(date) => setAppointmentDate(date)}

                    />
                </div>

            </div>
            <div className={styles.consentWrapper} onClick={toggleConsent}>
                <span>{acceptedSOA ? <Checked /> : <Unchecked strokeColor="#DDDDDD" />}</span>
                <span>{SOA_FORM_CONSENT}</span>
            </div>
            <SubmitButton variant="contained" onClick={handleSubmit} endIcon={<ButtonCircleArrow />}>
                {SUBMIT}
            </SubmitButton>
        </>

    )
}
SOAContactDetailsForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};