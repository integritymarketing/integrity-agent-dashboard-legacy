import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import { TextInput } from "components/MuiComponents";
import styles from "./MedicareIDDetails.module.scss";
import { formatMbiNumber } from "../../../utils/shared-utils/sharedUtility";
import DatePickerMUI from "../../DatePicker";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";

const MedicareIDDetails = ({ formik }) => {
    const [calendarPartAOpen, setCalendarPartAOpen] = useState(false);
    const [calendarPartBOpen, setCalendarPartBOpen] = useState(false);

    const { errors, values, handleChange, handleBlur, setFieldValue, validateField } = formik;
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextInput
                    label="Medicare Beneficiary ID Number"
                    fullWidth
                    type="text"
                    placeholder="####-###-####"
                    name="medicareBeneficiaryID"
                    value={values.medicareBeneficiaryID}
                    onChange={(e) => {
                        const mbi = e.target.value;
                        const newValue = formatMbiNumber(mbi);
                        setFieldValue("medicareBeneficiaryID", newValue);
                        if (mbi.length >= 11) {
                            validateField("medicareBeneficiaryID");
                        }
                        handleChange(e);
                    }}
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
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    Part A Effective Date
                </Typography>
                <DatePickerMUI
                    value={values.partA}
                    onChange={(value) => {
                        setFieldValue("partA", value);
                    }}
                    endAdornment={
                        <Box
                            mr={1}
                            onClick={() => setCalendarPartAOpen(!calendarPartAOpen)}
                            sx={{ cursor: "pointer", transform: calendarPartAOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        >
                            <FontAwesomeIcon icon={faChevronDown} color="#4178FF" size={"lg"} />
                        </Box>
                    }
                    startAdornment={<FontAwesomeIcon icon={faCalendarDays} color="#4178FF" size={"2xl"} />}
                    className={styles.datePicker}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    Part B Effective Date
                </Typography>
                <DatePickerMUI
                    value={values.partB === null ? "" : values.partB}
                    onChange={(value) => {
                        setFieldValue("partB", value);
                    }}
                    endAdornment={
                        <Box
                            mr={1}
                            onClick={() => setCalendarPartBOpen(!calendarPartBOpen)}
                            sx={{ cursor: "pointer", transform: calendarPartBOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        >
                            <FontAwesomeIcon icon={faChevronDown} color="#4178FF" size={"lg"} />
                        </Box>
                    }
                    startAdornment={<FontAwesomeIcon icon={faCalendarDays} color="#4178FF" size={"2xl"} />}
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
