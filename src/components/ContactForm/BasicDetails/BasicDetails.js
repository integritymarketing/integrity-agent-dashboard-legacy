import React from "react";
import { FormControl, Grid, TextField, Typography } from "@mui/material";
import styles from "./BasicDetails.module.scss";
import { onlyAlphabets } from "../../../utils/shared-utils/sharedUtility";
import DatePickerMUI from "../../../components/DatePicker";
import { formatDate } from "../../../utils/dates";
import * as PropTypes from "prop-types";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCalendarDays } from "@fortawesome/free-solid-svg-icons";

const BasicDetails = ({ formik, fieldSet }) => {
    const { values, errors, touched, submitCount, handleChange, handleBlur, setFieldValue } = formik;
    return (
        <Grid container spacing={2} ref={fieldSet}>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
                    First Name*
                </Typography>
                <TextField
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
                <Typography variant="h5" color="#052a63">
                    Last Name*
                </Typography>
                <TextField
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
                <Typography variant="h5" color="#052a63">
                    Middle Initial
                </Typography>
                <TextField
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
                <Typography variant="h5" color="#052a63">
                    Birthdate
                </Typography>
                <DatePickerMUI
                    value={values.birthdate}
                    disableFuture={true}
                    onChange={(value) => {
                        setFieldValue("birthdate", formatDate(value));
                    }}
                    endAdornment={
                            <FontAwesomeIcon icon={faAngleDown} color="#0052cf" size={"xl"} />
                    }
                    startAdornment={
                            <FontAwesomeIcon icon={faCalendarDays} color="#0052cf" size={"2xl"} />
                    }
                    className={styles.datePicker}
                />

                {errors.birthdate && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.birthdate}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
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
                        <MenuItem value="">None</MenuItem>
                        {["Mr.", "Mrs.", "Ms.", "Miss"].map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
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
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="Jr.">Jr.</MenuItem>
                        <MenuItem value="Sr.">Sr.</MenuItem>
                        <MenuItem value="II">II</MenuItem>
                        <MenuItem value="III">III</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
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
                        {["Single", "Married", "Domestic Partner", "Divorced", "Widow", "Unknown"].map((option) => (
                            <MenuItem key={option.toLowerCase()} value={option.toLowerCase()}>
                                {option}
                            </MenuItem>
                        ))}
                        <MenuItem key={"none"} value={""}>
                            None
                        </MenuItem>
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
