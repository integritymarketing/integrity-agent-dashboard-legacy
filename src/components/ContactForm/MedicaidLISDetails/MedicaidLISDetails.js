import React from "react";
import { Grid, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import PropTypes from "prop-types";

const MedicaidLISDetails = ({ formik }) => {
    const { values, handleChange } = formik;
    const toggleButtonSelectedStyle = {
        "&.Mui-selected": {
            backgroundColor: "#4178FF",
            color: "#fff",
            borderColor: "#052a63",
        },
    };
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
                    Medicaid
                </Typography>
                <ToggleButtonGroup value={values.medicaid} exclusive onChange={handleChange} fullWidth>
                    <ToggleButton value="yes" sx={toggleButtonSelectedStyle} name="medicaid">
                        Yes
                    </ToggleButton>
                    <ToggleButton value="no" sx={toggleButtonSelectedStyle} name="medicaid">
                        No
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
                    LIS
                </Typography>
                <ToggleButtonGroup value={values.lis} exclusive onChange={handleChange} fullWidth>
                    <ToggleButton value="yes" name="lis" sx={toggleButtonSelectedStyle}>
                        Yes
                    </ToggleButton>
                    <ToggleButton value="no" name="lis" sx={toggleButtonSelectedStyle}>
                        No
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
        </Grid>
    );
};

MedicaidLISDetails.propTypes = {
    formik: PropTypes.object.isRequired,
};

export default MedicaidLISDetails;
