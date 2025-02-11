import { useRef, useEffect, useCallback } from "react";
import { Grid, Typography } from "@mui/material";
import { TextInput } from "components/MuiComponents";
import PropTypes from "prop-types";
import { SelectableButtonGroup } from "@integritymarketing/clients-ui-kit";
import styles from "./CommunicationDetails.module.scss";

const CommunicationDetails = ({ formik }) => {
    const { touched, errors, values, handleChange, handleBlur, submitCount, setFieldValue, setTouched } = formik;
    const { email, primaryCommunication, phones } = values;
    const leadPhone = phones?.leadPhone || "";

    const emailFieldRef = useRef(null);
    const phoneFieldRef = useRef(null);
    const fieldRefs = { email: emailFieldRef, phone: phoneFieldRef };

    // Auto-update primaryCommunication if valid input is detected
    useEffect(() => {
        if (email && !leadPhone) {
            setFieldValue("primaryCommunication", "email");
        } else if (!email && leadPhone) {
            setFieldValue("primaryCommunication", "phone");
        }
    }, [email, leadPhone, setFieldValue]);

    // Handle field change with useCallback
    const handleFieldChange = useCallback(
        (ev) => {
            handleChange(ev);
        },
        [handleChange]
    );

    // Handle primary communication selection
    const handlePrimarySelect = useCallback(
        (selected) => {
            const selectedValue = selected.toLowerCase();
            setFieldValue("primaryCommunication", selectedValue);
            if (fieldRefs[selectedValue]?.current) {
                fieldRefs[selectedValue].current.focus();
            }

            // Mark the respective field as touched when switching
            if (selectedValue === "phone") {
                setTouched({
                    phones: { leadPhone: true },
                    email: false, // Reset email touched state
                });
            } else {
                setTouched({
                    email: true,
                    phones: { leadPhone: false }, // Reset phone touched state
                });
            }
        },
        [setFieldValue, setTouched]
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextInput
                    label="Email"
                    inputRef={emailFieldRef}
                    fullWidth
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleFieldChange}
                    onBlur={handleBlur}
                    error={errors.email}
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
                    inputRef={phoneFieldRef}
                    fullWidth
                    type="tel"
                    inputProps={{ maxLength: 10 }}
                    placeholder="###-###-####"
                    name="phones.leadPhone"
                    value={leadPhone}
                    onChange={handleFieldChange}
                    onBlur={handleBlur}
                    error={errors.phones?.leadPhone}
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
                    buttonOptions={["Email", "Phone"]}
                    buttonClassNames={["email", "phone"].map((option) =>
                        option === primaryCommunication ? [styles.selectedOption] : [styles.nonSelectedOption]
                    )}
                    onSelect={handlePrimarySelect}
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
    formik: PropTypes.shape({
        touched: PropTypes.object.isRequired,
        errors: PropTypes.object.isRequired,
        values: PropTypes.object.isRequired,
        handleChange: PropTypes.func.isRequired,
        handleBlur: PropTypes.func.isRequired,
        submitCount: PropTypes.number.isRequired,
        setFieldValue: PropTypes.func.isRequired,
        setTouched: PropTypes.func.isRequired,
    }).isRequired,
};

export default CommunicationDetails;