import PropTypes from 'prop-types';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import DatePickerMUI from "components/DatePicker";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import {
    BIRTHDATE, CANCEL, EDIT_HEALTH_INFO, FEET_PLACEHOLDER, GENDER, GENDER_OPTS, HEIGHT, INCH_PLACEHOLDER,
    MMDDYY,
    SAVE, SMOKER_OPTS, TOBACCO_USE, UPDATED, WEIGHT, WT_PLACEHOLDER, WT_UNIT
} from "../HealthContainer.constants";
import styles from "./HealthInfoContainer.module.scss";
import { useMemo, useState } from 'react';
import { formatDate, formatServerDate, parseDate } from 'utils/dates';

const StyledSaveButton = styled(Button)(() => ({
    borderRadius: "20px",
    color: "#FFFFFF",
    background: "#4178ff",
    textTransform: "none",
    fontWeight: "600",
    boxShadow: "none",
    height: "40px"
}));

export const EditHealthInfo = ({ birthdate, sexuality, wt, hFeet,
    hInch, smoker, modifyDate, updatedOn, onSave, onCancel }) => {

    const [gender, setGender] = useState(sexuality);
    const [bDate, setBDate] = useState(birthdate);
    const [feet, setFeet] = useState(hFeet);
    const [inch, setInch] = useState(hInch);
    const [weight, setWeight] = useState(wt);
    const [isTobaccoUser, setIsTobaccoUser] = useState(smoker)

    const updateFeet = (value) => {
        if (!value || value > 0 && value <= 8 && !value.includes('.')) {
            setFeet(value)
        }
    }

    const updateInch = (value) => {
        if (!value || value > 0 && value <= 12 && !value.includes('.')) {
            setFeet(value)
        }
    }
    const updateWeight = (value) => {
        if (!value || value > 0 && value < 999) {
            setWeight(value)
        }
    }

    const onSaveHealthInfo = () => {
        const birthdate = formatServerDate(parseDate(formatDate(bDate)));
        const formData = { gender, birthdate, height: +(feet * 12) + +inch, weight, isTobaccoUser: isTobaccoUser === "Yes" };
        onSave(formData);
    }
    const genderOptions = useMemo(() => GENDER_OPTS.map((option) => (
        <div key={option} className={`${styles.valueBox} ${option === gender ? styles.selected : ""}`} onClick={() => setGender(option)}>
            {option}
        </div>
    )), [gender]);


    const smokerOptions = useMemo(() => SMOKER_OPTS.map((option) => (
        <div key={option} className={`${styles.valueBox} ${option === isTobaccoUser ? styles.selected : ""}`} onClick={() => setIsTobaccoUser(option)}>
            {option}
        </div>
    )), [isTobaccoUser]);

    return (
        <div className={styles.healthInfoContainer}>
            <div className={styles.header}>{EDIT_HEALTH_INFO}</div>
            {/* Gender Selection */}
            <div className={styles.inputBox}>
                <div className={styles.labelEdit}>{GENDER}</div>
                <div className={styles.valueWrapper}>
                    {genderOptions}
                </div>
            </div>

            {/* Birthdate Picker */}
            <div className={styles.inputBox}>
                <div className={styles.labelEdit}>{BIRTHDATE}</div>
                <DatePickerMUI
                    value={bDate}
                    disableFuture={true}
                    onChange={(value) => setBDate(formatDate(value))}
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
                <div className={styles.labelEdit}>{TOBACCO_USE}</div>
                <div className={styles.valueWrapper}>
                    {smokerOptions}
                </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.editCtas}>
                <div onClick={onCancel} className={styles.cancel}>{CANCEL}</div>
                <StyledSaveButton variant="contained" onClick={() => onSaveHealthInfo()} endIcon={<ButtonCircleArrow />}>
                    {SAVE}
                </StyledSaveButton>
            </div>

            {/* Updated Timestamp */}
            <div className={styles.updatedTimestamp}>{`${UPDATED}${formatDate(modifyDate, MMDDYY)}`}</div>
        </div>
    )
}

EditHealthInfo.propTypes = {
    birthdate: PropTypes.string,
    modifyDate: PropTypes.string,
    sexuality: PropTypes.string,
    wt: PropTypes.number,
    hFeet: PropTypes.number,
    hInch: PropTypes.number,
    smoker: PropTypes.string,
    updatedOn: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};