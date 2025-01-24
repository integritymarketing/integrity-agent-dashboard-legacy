import React from "react";
import { Grid, Typography } from "@mui/material";
import { TextInput } from "components/MuiComponents";
import { formatPhoneNumber } from "../../../utils/phones";
import PropTypes from "prop-types";
import { SelectableButtonGroup } from "@integritymarketing/clients-ui-kit";
import styles from "./CommunicationDetails.module.scss";

const CommunicationDetails = ({ formik }) => {
    const { touched, errors, values, handleChange, handleBlur, submitCount, setFieldValue } = formik;
    const valueOptions = { Email: "email", Phone: "phone" };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextInput
                    label="Email"
                    fullWidth
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={(ev) => {
                        setFieldValue("primaryCommunication", "email");
                        handleChange(ev);
                    }}
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
                <TextInput
                    label="Phone"
                    fullWidth
                    type="tel"
                    placeholder="###-###-####"
                    name="phones.leadPhone"
                    value={formatPhoneNumber(values.phones.leadPhone) || ""}
                    onChange={(ev) => {
                        setFieldValue("primaryCommunication", "phone");
                        handleChange(ev);
                    }}
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
                <Typography variant="h5" color="#052a63" marginBottom={0.5}>
                    Primary Contact Method*
                </Typography>
                <SelectableButtonGroup
                    buttonOptions={Object.keys(valueOptions)}
                    buttonClassNames={Object.keys(valueOptions).map((option) =>
                        valueOptions[option] === values.primaryCommunication
                            ? styles.selectedOption
                            : styles.nonSelectedOption,
                    )}
                    onSelect={(selected) => {
                        setFieldValue("primaryCommunication", valueOptions[selected]);
                    }}
                />
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
