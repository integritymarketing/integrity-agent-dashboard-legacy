import React from "react";
import { FormControl, Grid, Typography } from "@mui/material";
import { TextInput } from "components/MuiComponents";
import styles from "./BasicDetails.module.scss";
import { onlyAlphabets } from "../../../utils/shared-utils/sharedUtility";
import DatePickerMUI from "../../../components/DatePicker";
import { formatDate } from "../../../utils/dates";
import PropTypes from "prop-types";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { contactFormMaritalStatusOptions, contactFormPrefixOptions, contactFormSuffixOptions } from "utils/contactForm";

const BasicDetails = ({ formik, fieldSet }) => {
    const { values, errors, touched, submitCount, handleChange, handleBlur, setFieldValue } = formik;
    return (
        <Grid container spacing={2} ref={fieldSet}>
            <Grid item xs={12} md={6}>
                <TextInput
                    label="First Name*"
                    variant="outlined"
                    fullWidth
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={(touched.firstName || submitCount > 0) && errors.firstName}
                />
                {(touched.firstName || submitCount > 0) && errors.firstName && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.firstName}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} md={6}>
                <TextInput
                    label="Last Name*"
                    fullWidth
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={(touched.lastName || submitCount > 0) && errors.lastName}
                />
                {(touched.lastName || submitCount > 0) && errors.lastName && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.lastName}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} md={6}>
                <TextInput
                    label="Middle Initial"
                    variant="outlined"
                    fullWidth
                    name="middleName"
                    onKeyDown={onlyAlphabets}
                    maxLength="1"
                    value={values.middleName?.toUpperCase()}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    Birthdate
                </Typography>
                <DatePickerMUI
                    value={values.birthdate}
                    disableFuture={true}
                    onChange={(value) => {
                        setFieldValue("birthdate", formatDate(value));
                    }}
                    endAdornment={<FontAwesomeIcon icon={faAngleDown} color="#0052cf" size={"xl"} />}
                    startAdornment={<FontAwesomeIcon icon={faCalendarDays} color="#0052cf" size={"2xl"} />}
                    className={styles.datePicker}
                />

                {errors.birthdate && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.birthdate}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    Prefix
                </Typography>
                <FormControl fullWidth variant="outlined">
                    <Select
                        value={values.prefix}
                        IconComponent={() => (
                            <Box mr={1}>
                                <FontAwesomeIcon icon={faAngleDown} color="#0052cf" size={"xl"} />
                            </Box>
                        )}
                        renderValue={(selected) => {
                            if (selected == null) {
                                return "Select";
                            } else if (selected == "") {
                                return "None";
                            }
                            return selected;
                        }}
                        name="prefix"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        displayEmpty
                    >
                        {contactFormPrefixOptions.map(({ value, label }) => (
                            <MenuItem key={label} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    Suffix
                </Typography>
                <FormControl fullWidth variant="outlined">
                    <Select
                        value={values.suffix}
                        IconComponent={() => (
                            <Box mr={1}>
                                <FontAwesomeIcon icon={faAngleDown} color="#0052cf" size={"xl"} />
                            </Box>
                        )}
                        renderValue={(selected) => {
                            if (selected === null) {
                                return "Select";
                            } else if (selected === "") {
                                return "None";
                            }
                            return selected;
                        }}
                        displayEmpty
                        name="suffix"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    >
                        {contactFormSuffixOptions.map(({ value, label }) => (
                            <MenuItem key={label} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    Marital Status
                </Typography>
                <FormControl fullWidth variant="outlined">
                    <Select
                        value={values.maritalStatus}
                        IconComponent={() => (
                            <Box mr={1}>
                                <FontAwesomeIcon icon={faAngleDown} color="#0052cf" size={"xl"} />
                            </Box>
                        )}
                        renderValue={(selected) => {
                            if (selected === null) {
                                return "Select";
                            } else if (selected === "") {
                                return "None";
                            }
                            return selected;
                        }}
                        displayEmpty
                        name="maritalStatus"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    >
                        {contactFormMaritalStatusOptions.map(({ value, label }) => (
                            <MenuItem key={label.toLowerCase()} value={value.toLowerCase()}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

BasicDetails.propTypes = {
    formik: PropTypes.object,
    fieldSet: PropTypes.object,
};

export default BasicDetails;
