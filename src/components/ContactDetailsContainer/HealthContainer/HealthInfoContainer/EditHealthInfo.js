/* eslint-disable max-lines-per-function */
import React, { useCallback, useEffect, useState } from "react";

import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";

import PropTypes from "prop-types";

import { formatDate } from "utils/dates";

import useAnalytics from "hooks/useAnalytics";

import DatePickerMUI from "components/DatePicker";
import SelectableButtonGroup from "components/SelectableButtonGroup";
import ButtonCircleArrow from "components/icons/button-circle-arrow";

import styles from "./HealthInfoContainer.module.scss";

import {
    BIRTHDATE,
    CANCEL,
    EDIT_HEALTH_INFO,
    FEET_PLACEHOLDER,
    GENDER,
    GENDER_OPTS,
    HEIGHT,
    INCH_PLACEHOLDER,
    SAVE,
    SMOKER_OPTS,
    TOBACCO_USE,
    WEIGHT,
    WT_PLACEHOLDER,
    WT_UNIT,
} from "../HealthContainer.constants";

const StyledSaveButton = styled(Button)(() => ({
    borderRadius: "20px",
    color: "#FFFFFF",
    background: "#4178ff",
    textTransform: "none",
    fontWeight: "600",
    boxShadow: "none",
    height: "40px",
}));

export const EditHealthInfo = ({ birthdate, sexuality, wt, hFeet, hInch, smoker, onSave, onCancel, leadId }) => {
    const [gender, setGender] = useState(sexuality);
    const [bDate, setBDate] = useState(birthdate);
    const [feet, setFeet] = useState(hFeet);
    const [inch, setInch] = useState(hInch);
    const [weight, setWeight] = useState(wt);
    const [isTobaccoUser, setIsTobaccoUser] = useState(smoker);
    const [isModified, setIsModified] = useState(false);
    const { fireEvent } = useAnalytics();

    useEffect(() => {
        setIsModified(
            sexuality !== gender ||
                birthdate !== bDate ||
                hFeet !== feet ||
                hInch !== inch ||
                wt !== weight ||
                smoker !== isTobaccoUser
        );
    }, [gender, bDate, feet, inch, weight, isTobaccoUser, sexuality, birthdate, hFeet, hInch, wt, smoker]);

    const updateFeet = useCallback((value) => {
        if (!value || (value > 0 && value <= 8 && !value.includes("."))) {
            setFeet(value);
        }
    }, []);

    const updateInch = useCallback(
        (value) => {
            if (value === "" || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 11)) {
                setInch(value);
            }
        },
        [setInch]
    );

    const updateWeight = useCallback((value) => {
        if (!value || (value > 0 && value < 999)) {
            setWeight(value);
        }
    }, []);

    const onSaveHealthInfo = useCallback(() => {
        const formData = {
            gender,
            birthdate: bDate ? formatDate(bDate) : "",
            height: feet ? Number(feet * 12) + Number(inch) : null,
            weight: weight ? weight : null,
            isTobaccoUser: isTobaccoUser === "Yes",
        };
        onSave(formData);

        fireEvent("Health Conditions Page Viewed", {
            leadid: leadId,
            flow: "health_profile",
        });
    }, [bDate, feet, gender, inch, isTobaccoUser, onSave, weight]);

    const handleSelectGender = useCallback((value) => {
        setGender(value);
    }, []);

    const handleSelectTobacco = useCallback((value) => {
        setIsTobaccoUser(value);
    }, []);

    return (
        <div className={styles.healthInfoContainer}>
            <div className={styles.header}>{EDIT_HEALTH_INFO}</div>
            {/* Gender Selection */}
            <div className={styles.inputBox}>
                <SelectableButtonGroup
                    labelText={GENDER}
                    selectedButtonText={gender}
                    buttonOptions={GENDER_OPTS}
                    onSelect={handleSelectGender}
                />
            </div>

            {/* Birthdate Picker */}
            <div className={styles.inputBox}>
                <div className={styles.labelEdit}>{BIRTHDATE}</div>
                <DatePickerMUI
                    value={bDate}
                    disableFuture={true}
                    onChange={(value) => setBDate(value)}
                    className={styles.datepicker}
                />
            </div>

            {/* Height Inputs */}
            <div className={styles.inputBox}>
                <div className={styles.labelEdit}>{HEIGHT}</div>
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

            {/* Weight Input */}
            <div className={styles.inputBox}>
                <div className={styles.labelEdit}>{`${WEIGHT} (${WT_UNIT})`}</div>
                <input
                    type="number"
                    value={weight}
                    className={styles.input}
                    placeholder={WT_PLACEHOLDER}
                    onChange={(e) => updateWeight(e.target.value)}
                />
            </div>

            {/* Smoker Selection */}
            <div className={styles.inputBox}>
                <SelectableButtonGroup
                    labelText={TOBACCO_USE}
                    selectedButtonText={isTobaccoUser}
                    buttonOptions={SMOKER_OPTS}
                    onSelect={handleSelectTobacco}
                />
            </div>

            {/* Action Buttons */}
            <div className={styles.editCtas}>
                <div onClick={onCancel} className={styles.cancel}>
                    {CANCEL}
                </div>
                <StyledSaveButton
                    disabled={!isModified}
                    variant="contained"
                    onClick={() => onSaveHealthInfo()}
                    endIcon={<ButtonCircleArrow />}
                >
                    {SAVE}
                </StyledSaveButton>
            </div>
        </div>
    );
};

EditHealthInfo.propTypes = {
    birthdate: PropTypes.string.isRequired,
    sexuality: PropTypes.string.isRequired,
    wt: PropTypes.number.isRequired,
    hFeet: PropTypes.number.isRequired,
    hInch: PropTypes.number.isRequired,
    smoker: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};
