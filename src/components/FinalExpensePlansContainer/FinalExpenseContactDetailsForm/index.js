import { useEffect, useMemo, useState } from "react";
import { InputAdornment, OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";
import { useLeadDetails } from "providers/ContactDetails";
import { formatDate } from "utils/dates";
import DatePickerMUI from "components/DatePicker";
import { SelectStateField } from "components/SharedFormFields";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import { Button } from "components/ui/Button";
import styles from "./FinalExpenseContactDetailsForm.module.scss";
import {
    BIRTHDATE,
    CONTACT_FORM_SUBTITLE,
    CONTACT_FORM_SUBTITLE_MOBILE,
    CONTACT_FORM_TITLE,
    FEET_PLACEHOLDER,
    GENDER,
    GENDER_OPTS,
    HEIGHT,
    INCH_PLACEHOLDER,
    NEXT,
    REQUIRED_FIELDS,
    SAVING,
    SMOKER_OPTS,
    STATE,
    TOBACCO_USE,
    WEIGHT,
    WT_PLACEHOLDER,
} from "../FinalExpensePlansContainer.constants";
import { useFormik } from "formik";
import { FinalExpenseIntakeForm } from "schemas";

const FinalExpenseContactDetailsForm = ({ contactId, onSave }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [mobileStepNumber, setMobileStepNumber] = useState(0);

    const [formData, setFormData] = useState({
        stateCode: null,
        gender: null,
        dateOfBirth: null,
        feet: null,
        inch: null,
        weight: null,
        isTobaccoUser: null,
    });

    const { leadDetails } = useLeadDetails();

    const onSaveHealthInfo = async () => {
        const dateOfBirth = values.dateOfBirth ? formatDate(values.dateOfBirth) : "";
        const updatedFormData = {
            stateCode: values.stateCode,
            gender: values.gender,
            birthdate: dateOfBirth,
            height: values.feet ? Number(values.feet * 12) + Number(values.feet) : null,
            weight: values.weight ? values.weight : null,
            isTobaccoUser: values.isTobaccoUser,
        };
        setIsSaving(true);
        await onSave(updatedFormData);
        setIsSaving(false);
    };

    const handleNext = async () => {
        await onSaveHealthInfo();
    };

    const formik = useFormik({
        validateOnMount: true,
        initialValues: formData,
        validationSchema: FinalExpenseIntakeForm,
        enableReinitialize: true,
        onSubmit: handleNext,
    });

    const { values, dirty, isValid, setFieldValue, handleSubmit } = formik;

    useEffect(() => {
        if (leadDetails) {
            const sessionItem = sessionStorage.getItem(contactId);
            const code = sessionItem ? JSON.parse(sessionItem).stateCode : leadDetails?.addresses?.[0]?.stateCode;

            const hFeet = leadDetails?.height ? Math.floor(leadDetails?.height / 12) : "";
            const hInch = leadDetails?.height ? leadDetails?.height % 12 : "";

            setFormData((prevFormData) => ({
                ...prevFormData,
                stateCode: code,
                gender: leadDetails?.gender,
                dateOfBirth: leadDetails?.birthdate,
                feet: hFeet,
                inch: hInch,
                weight: leadDetails?.weight,
                isTobaccoUser: leadDetails?.isTobaccoUser,
            }));
        }
    }, [leadDetails, contactId]);

    const updateFeet = (value) => {
        if (!value || (value > 0 && value <= 8 && !value.includes("."))) {
            setFieldValue("feet", value);
        }
    };

    const updateInch = (value) => {
        const numericValue = Number(value);

        if (value === "" || (Number.isInteger(numericValue) && numericValue >= 0 && numericValue <= 11)) {

            if (numericValue === 0 && value.length > 1) {
                setFieldValue("inch", "0");
            } else {
                setFieldValue("inch", value);
            }
        }
    };

    const updateWeight = (value) => {
        if (!value || (value > 0 && value < 999)) {
            setFieldValue("weight", value);
        }
    };

    const genderOptions = useMemo(
        () =>
            GENDER_OPTS.map((option) => (
                <div
                    key={option.label}
                    className={`${styles.optionValueBox} ${option.value === values.gender ? styles.selected : ""}`}
                    onClick={() => setFieldValue("gender", option.value)}
                >
                    {option.label}
                </div>
            )),
        [values.gender, setFieldValue],
    );

    const smokerOptions = useMemo(
        () =>
            SMOKER_OPTS.map((option) => (
                <div
                    key={option.label}
                    className={`${styles.optionValueBox} ${option.value === values.isTobaccoUser ? styles.selected : ""}`}
                    onClick={() => setFieldValue("isTobaccoUser", option.value)}
                >
                    {option.label}
                </div>
            )),
        [values.isTobaccoUser, setFieldValue],
    );

    const stateBox = (
        <div className={styles.contactFormCol}>
            <div className={styles.formLabel}>{STATE}*</div>
            <SelectStateField
                selectContainerClassName={styles.selectInputBox}
                inputBoxClassName={styles.inputBoxClassName}
                className={styles.stateSelect}
                value={values.stateCode}
                onChange={(val) => setFieldValue("stateCode", val)}
            />
        </div>
    );

    const heightBox = (
        <div className={styles.contactFormCol}>
            <div className={styles.formLabel}>{HEIGHT}</div>
            <div className={styles.heightSpec}>
                <OutlinedInput
                    value={values.feet}
                    onChange={(e) => updateFeet(e.target.value)}
                    endAdornment={<InputAdornment position="end">{FEET_PLACEHOLDER}</InputAdornment>}
                />
                <OutlinedInput
                    value={values.inch}
                    onChange={(e) => updateInch(e.target.value)}
                    endAdornment={<InputAdornment position="end">{INCH_PLACEHOLDER}</InputAdornment>}
                />
            </div>
        </div>
    );

    const genderBox = (
        <div className={styles.contactFormCol}>
            <div className={styles.formLabel}>{GENDER}*</div>
            <div className={styles.optionValueWrapper}>{genderOptions}</div>
        </div>
    );

    const weightBox = (
        <div className={styles.contactFormCol}>
            <div className={styles.formLabel}>{WEIGHT}</div>
            <input
                type="number"
                value={values.weight}
                className={styles.input}
                placeholder={WT_PLACEHOLDER}
                onChange={(e) => updateWeight(e.target.value)}
            />
        </div>
    );

    const dobBox = (
        <div className={styles.contactFormCol}>
            <div className={styles.formLabel}>{BIRTHDATE}*</div>
            <DatePickerMUI
                value={values.dateOfBirth}
                disableFuture={true}
                onChange={(value) => setFieldValue("dateOfBirth", formatDate(value))}
                className={styles.datepicker}
                iconPosition="left"
            />
        </div>
    );

    const tobaccoBox = (
        <div className={styles.contactFormCol}>
            <div className={styles.formLabel}>{TOBACCO_USE}*</div>
            <div className={styles.optionValueWrapper}>{smokerOptions}</div>
        </div>
    );

    const isDisabled = useMemo(() => !dirty || !isValid, [dirty, isValid]);

    return (
        <div className={styles.finalExpenseContactDetailsForm}>
            <div className={styles.contactCard}>
                <div className={styles.contactCardHeading}>
                    <h4>{mobileStepNumber === 0 ? CONTACT_FORM_TITLE : CONTACT_FORM_SUBTITLE_MOBILE}</h4>
                    {mobileStepNumber === 0 && <p>{CONTACT_FORM_SUBTITLE}</p>}
                </div>
                <div className={styles.contactForm}>
                    <div className={styles.contactFormRow}>
                        {stateBox}
                        {heightBox}
                    </div>
                    <div className={styles.contactFormRow}>
                        {genderBox}
                        {weightBox}
                    </div>
                    <div className={styles.contactFormRow}>
                        {dobBox}
                        {tobaccoBox}
                    </div>
                </div>
                <div className={styles.contactFooter}>
                    <Button
                        disabled={isDisabled}
                        label={isSaving ? SAVING : NEXT}
                        onClick={handleSubmit}
                        type="primary"
                        icon={<ButtonCircleArrow />}
                        fullWidth={true}
                        iconPosition="right"
                        style={{ border: "none" }}
                        className={styles.nextButton}
                    />
                </div>
                <div className={styles.contactFormMobile}>
                    {mobileStepNumber === 0 && (
                        <>
                            <div className={styles.contactFormRow}>{stateBox}</div>
                            <div className={styles.contactFormRow}>{genderBox}</div>
                            <div className={styles.contactFormRow}>{dobBox}</div>
                        </>
                    )}
                    {mobileStepNumber === 1 && (
                        <>
                            <div className={styles.contactFormRow}>{heightBox}</div>
                            <div className={styles.contactFormRow}>{weightBox}</div>
                            <div className={styles.contactFormRow}>{tobaccoBox}</div>
                        </>
                    )}
                    <div className={styles.contactFooterMobile}>
                        {mobileStepNumber === 0 && (
                            <Button
                                disabled={isDisabled}
                                label={NEXT}
                                onClick={() => setMobileStepNumber(1)}
                                type="primary"
                                icon={<ButtonCircleArrow />}
                                fullWidth={true}
                                iconPosition="right"
                                style={{ border: "none" }}
                                className={styles.nextButton}
                            />
                        )}
                        {mobileStepNumber === 1 && (
                            <Button
                                disabled={isDisabled || isSaving}
                                label={isSaving ? SAVING : NEXT}
                                onClick={handleSubmit}
                                type="primary"
                                icon={<ButtonCircleArrow />}
                                fullWidth={true}
                                iconPosition="right"
                                style={{ border: "none" }}
                                className={styles.nextButton}
                            />
                        )}
                    </div>
                </div>
            </div>
            <p className={styles.requiredFieldsText}>{REQUIRED_FIELDS}</p>
        </div>
    );
};

FinalExpenseContactDetailsForm.propTypes = {
    contactId: PropTypes.string.isRequired,
    address: PropTypes.shape({
        stateCode: PropTypes.string,
    }),
    birthdate: PropTypes.string,
    sexuality: PropTypes.string,
    wt: PropTypes.number,
    hFeet: PropTypes.number,
    hInch: PropTypes.number,
    smoker: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
};

export default FinalExpenseContactDetailsForm;
