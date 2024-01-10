import React, { useEffect, useMemo, useState } from "react";

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

const FinalExpenseContactDetailsForm = ({
    contactId,

    onSave,
}) => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [mobileStepNumber, setMobileStepNumber] = useState(0);

    const [stateCode, setStateCode] = useState(null);
    const [gender, setGender] = useState(null);
    const [bDate, setBDate] = useState(null);
    const [feet, setFeet] = useState(null);
    const [inch, setInch] = useState(null);
    const [weight, setWeight] = useState(null);
    const [isTobaccoUser, setIsTobaccoUser] = useState(null);

    const { leadDetails } = useLeadDetails();

    useEffect(() => {
        if (leadDetails) {
            const sessionItem = sessionStorage.getItem(contactId);
            const code = sessionItem ? JSON.parse(sessionItem).stateCode : leadDetails?.addresses?.[0]?.stateCode;

            let hFeet = leadDetails?.height ? Math.floor(leadDetails?.height / 12) : "";
            let hInch = leadDetails?.height ? leadDetails?.height % 12 : "";

            setGender(leadDetails?.gender);
            setBDate(leadDetails?.birthdate);
            setFeet(hFeet);
            setInch(hInch);
            setWeight(leadDetails?.weight);
            setIsTobaccoUser(leadDetails?.isTobaccoUser);
            setStateCode(code);
        }
    }, [leadDetails]);

    const updateFeet = (value) => {
        if (!value || (value > 0 && value <= 8 && !value.includes("."))) {
            setFeet(value);
        }
    };

    const updateInch = (value) => {
        if (!value || (value > 0 && value <= 12 && !value.includes("."))) {
            setInch(value);
        }
    };

    const updateWeight = (value) => {
        if (!value || (value > 0 && value < 999)) {
            setWeight(value);
        }
    };

    useEffect(() => {
        if (!stateCode || !gender || !bDate || isTobaccoUser === null) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [stateCode, gender, bDate, isTobaccoUser, setIsDisabled]);

    const onSaveHealthInfo = async () => {
        const birthdate = bDate ? formatDate(bDate) : "";
        const formData = { stateCode, gender, birthdate, height: +(feet * 12) + +inch, weight, isTobaccoUser };
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    const handleNext = async () => {
        onSaveHealthInfo();
    };

    const genderOptions = useMemo(
        () =>
            GENDER_OPTS.map((option) => (
                <div
                    key={option}
                    className={`${styles.optionValueBox} ${option === gender ? styles.selected : ""}`}
                    onClick={() => setGender(option)}
                >
                    {option}
                </div>
            )),
        [gender]
    );

    const smokerOptions = useMemo(
        () =>
            SMOKER_OPTS.map((option) => (
                <div
                    key={option.label}
                    className={`${styles.optionValueBox} ${option.value === isTobaccoUser ? styles.selected : ""}`}
                    onClick={() => setIsTobaccoUser(option.value)}
                >
                    {option.label}
                </div>
            )),
        [isTobaccoUser]
    );

    const stateBox = (
        <div className={styles.contactFormCol}>
            <div className={styles.formLabel}>{STATE}*</div>
            <SelectStateField
                selectContainerClassName={styles.selectInputBox}
                inputBoxClassName={styles.inputBoxClassName}
                className={styles.stateSelect}
                value={stateCode}
                onChange={(val) => setStateCode(val)}
            />
        </div>
    );

    const heightBox = (
        <div className={styles.contactFormCol}>
            <div className={styles.formLabel}>{HEIGHT}</div>
            <div className={styles.heightSpec}>
                <OutlinedInput
                    value={feet}
                    onChange={(e) => updateFeet(e.target.value)}
                    endAdornment={<InputAdornment position="end">{FEET_PLACEHOLDER}</InputAdornment>}
                />
                <OutlinedInput
                    value={inch}
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
                value={weight}
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
                value={bDate}
                disableFuture={true}
                onChange={(value) => setBDate(formatDate(value))}
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
                        disabled={isDisabled || isSaving}
                        label={isSaving ? SAVING : NEXT}
                        onClick={handleNext}
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
                                disabled={!stateCode || !bDate}
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
                                onClick={handleNext}
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
