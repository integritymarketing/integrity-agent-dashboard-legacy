import React from "react";
import { Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { SelectableButtonGroup } from "@integritymarketing/clients-ui-kit";
import styles from "./MedicaidLISDetails.module.scss";

const MedicaidLISDetails = ({ formik }) => {
    const { values, setFieldValue } = formik;
    const medicAidOptions = { Yes: 1, No: 0 };
    const lisOptions = { Yes: "Yes", No: "No" };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={6} md={6}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    Medicaid
                </Typography>
                <SelectableButtonGroup
                    buttonOptions={Object.keys(medicAidOptions)}
                    buttonClassNames={Object.keys(medicAidOptions).map((option) =>
                        medicAidOptions[option] === values.hasMedicAid
                            ? styles.selectedOption
                            : styles.nonSelectedOption,
                    )}
                    onSelect={(selected) => {
                        setFieldValue("hasMedicAid", medicAidOptions[selected]);
                    }}
                />
            </Grid>
            <Grid item xs={6} md={6}>
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    LIS
                </Typography>
                <SelectableButtonGroup
                    buttonOptions={Object.keys(lisOptions)}
                    buttonClassNames={Object.keys(lisOptions).map((option) =>
                        lisOptions[option] === values.subsidyLevel ? styles.selectedOption : styles.nonSelectedOption,
                    )}
                    onSelect={(selected) => {
                        setFieldValue("subsidyLevel", lisOptions[selected]);
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
