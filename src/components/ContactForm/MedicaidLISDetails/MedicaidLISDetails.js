import React from "react";
import { Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { SelectableButtonGroup } from "@integritymarketing/clients-ui-kit";
import styles from "./MedicaidLISDetails.module.scss";

const MedicaidLISDetails = ({ formik }) => {
    const { values, setFieldValue } = formik;
    const valueOptions = { Yes: 1, No: 0 };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
                    Medicaid
                </Typography>
                <SelectableButtonGroup
                    buttonOptions={Object.keys(valueOptions)}
                    buttonClassNames={Object.keys(valueOptions).map((option) =>
                        valueOptions[option] === values.hasMedicAid ? styles.selectedOption : styles.nonSelectedOption,
                    )}
                    onSelect={(selected) => {
                        setFieldValue("hasMedicAid", valueOptions[selected]);
                    }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h5" color="#052a63">
                    LIS
                </Typography>
                <SelectableButtonGroup
                    buttonOptions={Object.keys(valueOptions)}
                    buttonClassNames={Object.keys(valueOptions).map((option) =>
                        valueOptions[option] === values.lis ? styles.selectedOption : styles.nonSelectedOption,
                    )}
                    onSelect={(selected) => {
                        setFieldValue("lis", valueOptions[selected]);
                    }}
                />
            </Grid>
        </Grid>
    );
};

MedicaidLISDetails.propTypes = {
    formik: PropTypes.object.isRequired,
};

export default MedicaidLISDetails;
