import React from "react";
import { Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { formatPhoneNumber } from "../../../utils/phones";
import PropTypes from "prop-types";

const CommunicationDetails = ({ formik }) => {
    const { touched, errors, values, handleChange, handleBlur, submitCount } = formik;
    const toggleButtonSelectedStyle = {
        "&.Mui-selected": {
            backgroundColor: "#4178FF",
            color: "#fff",
            borderColor: "#052a63",
        },
    };
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
                    Email
                </Typography>
                <TextField
                    fullWidth
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                />
                {errors.email && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.email}
                    </Typography>
                )}
            </Grid>

            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
                    Phone
                </Typography>
                <TextField
                    fullWidth
                    type="tel"
                    placeholder="(XXX) XXX-XXXX"
                    name="phones.leadPhone"
                    value={formatPhoneNumber(values.phones.leadPhone) || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phones?.leadPhone && errors.phones?.leadPhone}
                />
                {errors.phones?.leadPhone && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.phones?.leadPhone}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5" color="#052a63">
                    Preferred Communication*
                </Typography>
                <ToggleButtonGroup value={values.primaryCommunication} exclusive onChange={handleChange} fullWidth>
                    <ToggleButton value="email" name="primaryCommunication" sx={toggleButtonSelectedStyle}>
                        Email
                    </ToggleButton>
                    <ToggleButton value="phone" name="primaryCommunication" sx={toggleButtonSelectedStyle}>
                        Phone
                    </ToggleButton>
                </ToggleButtonGroup>
                {(touched.primaryCommunication || submitCount > 0) && errors.primaryCommunication && (
                    <Typography variant="body2" color="error" mt={0.5}>
                        {errors.primaryCommunication}
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};

CommunicationDetails.propTypes = {
    formik: PropTypes.object.isRequired,
};

export default CommunicationDetails;
