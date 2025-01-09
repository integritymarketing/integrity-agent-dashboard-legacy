import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import styles from "./MedicareIDDetails.module.scss";
import { formatMbiNumber } from "../../../utils/shared-utils/sharedUtility";
import DatePickerMUI from "../../DatePicker";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCalendarDays } from "@fortawesome/free-solid-svg-icons";

const MedicareIDDetails = ({ formik }) => {
    const { errors, values, handleChange, handleBlur, setFieldValue } = formik;
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5" color="#052a63">
                    Medicare Beneficiary ID Number
                </Typography>
                <TextField
                    fullWidth
                    type="text"
                    placeholder="MBI Number"
                    name="medicareBeneficiaryID"
                    value={values.medicareBeneficiaryID}
                    onChange={handleChange}
                    onBlur={(e) => {
                        handleBlur(e);
                        setFieldValue("medicareBeneficiaryID", formatMbiNumber(values.medicareBeneficiaryID));
                    }}
                    error={errors?.medicareBeneficiaryID}
                />

                {errors?.medicareBeneficiaryID && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors?.medicareBeneficiaryID}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
                    Part A Effective Date
                </Typography>
                <DatePickerMUI
                    value={values.partA}
                    onChange={(value) => {
                        setFieldValue("partA", value);
                    }}
                    endAdornment={<FontAwesomeIcon icon={faAngleDown} color="#0052cf" size={"xl"} />}
                    startAdornment={<FontAwesomeIcon icon={faCalendarDays} color="#0052cf" size={"2xl"} />}
                    className={styles.datePicker}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
                    Part B Effective Date
                </Typography>
                <DatePickerMUI
                    value={values.partB === null ? "" : values.partB}
                    onChange={(value) => {
                        setFieldValue("partB", value);
                    }}
                    endAdornment={<FontAwesomeIcon icon={faAngleDown} color="#0052cf" size={"xl"} />}
                    startAdornment={<FontAwesomeIcon icon={faCalendarDays} color="#0052cf" size={"2xl"} />}
                    className={styles.datePicker}
                />
            </Grid>
        </Grid>
    );
};

MedicareIDDetails.propTypes = {
    formik: PropTypes.object.isRequired,
    styles: PropTypes.object,
};

export default MedicareIDDetails;
