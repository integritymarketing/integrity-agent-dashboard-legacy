import React, { useState } from "react";
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
    const [calendarOpen, setCalendarOpen] = useState(false);
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
                    value={values.middleName?.toUpperCase()}
                    onChange={(ev) => {
                        const inputValue = ev.target.value;
                        if (inputValue.length <= 1 && /^[a-zA-Z]*$/.test(inputValue)) {
                            handleChange(ev);
                        }
                    }}
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
                    endAdornment={
                        <Box
                            mr={1}
                            onClick={() => setCalendarOpen(!calendarOpen)}
                            sx={{ cursor: "pointer", transform: calendarOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        >
                            <FontAwesomeIcon icon={faAngleDown} color="#4178FF" size={"xl"} />
                        </Box>
                    }
                    startAdornment={<FontAwesomeIcon icon={faCalendarDays} color="#4178FF" size={"2xl"} />}
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
                        value={values.prefix || ""}
                        IconComponent={(props) => (
                            <Box mr={1} {...props}>
                                <FontAwesomeIcon icon={faAngleDown} color="#4178FF" size={"xl"} />
                            </Box>
                        )}
                        renderValue={(selected) => {
                            if (selected === "") {
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
                        value={values.suffix || ""}
                        IconComponent={(props) => (
                            <Box mr={1} {...props}>
                                <FontAwesomeIcon icon={faAngleDown} color="#4178FF" size={"xl"} />
                            </Box>
                        )}
                        renderValue={(selected) => {
                            if (selected === "") {
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
                        IconComponent={(props) => (
                            <Box mr={1} {...props}>
                                <FontAwesomeIcon icon={faAngleDown} color="#4178FF" size={"xl"} />
                            </Box>
                        )}
                        renderValue={(selected) =>
                            contactFormMaritalStatusOptions?.find((ms) => ms.value === selected)?.label
                        }
                        displayEmpty
                        name="maritalStatus"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    >
                        {contactFormMaritalStatusOptions.map(({ value, label }) => (
                            <MenuItem key={label} value={value}>
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
