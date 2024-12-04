import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Grid, InputAdornment, Typography } from "@mui/material";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import { useLeadDetails } from "providers/ContactDetails";
import { SelectStateField } from "components/SharedFormFields";
import SelectableButtonGroup from "components/SelectableButtonGroup";
import { formatDate } from "utils/dates";
import { TextInput } from "components/MuiComponents";
import DatePickerMUI from "components/DatePicker";
import ErrorIcon from "@mui/icons-material/Error";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FinalExpenseIntakeForm } from "schemas";
import WithLoader from "components/ui/WithLoader";
import styles from "./styles.module.scss";
import { formatPayload } from "utils/leadDataUtil";
import useAnalytics from "hooks/useAnalytics";
import ButtonCircleArrow from "components/icons/button-circle-arrow";

const FinalExpenseIntakeFormCard = () => {
    const navigate = useNavigate();
    const { fireEvent } = useAnalytics();
    const { handleClose, selectedLead: leadDetails, newLeadDetails } = useCreateNewQuote();
    const { updateLeadDetails, isLoadingLeadDetails } = useLeadDetails();
    const { isSimplifiedIUL } = useCreateNewQuote();

    const loc = useLocation();
    const leadId = leadDetails?.leadsId;
    const isContactType = newLeadDetails?.firstName ? "New Contact" : "Existing Contact";

    const [initialValues, setInitialValues] = useState({
        stateCode: null,
        gender: null,
        feet: null,
        inches: null,
        weight: null,
        dateOfBirth: null,
        isTobaccoUser: null,
    });

    useEffect(() => {
        if (leadDetails) {
            const sessionStateCode = JSON.parse(sessionStorage.getItem(leadId))?.stateCode ?? null;
            const stateCode = sessionStateCode || leadDetails?.addresses?.[0]?.stateCode;

            const feet = leadDetails?.height ? Math.floor(leadDetails.height / 12) : "";
            const inches = leadDetails?.height ? leadDetails.height % 12 : "";

            setInitialValues({
                stateCode,
                feet,
                inches,
                weight: leadDetails?.weight ? leadDetails?.weight : "",
                dateOfBirth: leadDetails?.birthdate ? leadDetails?.birthdate : null,
                isTobaccoUser:
                    leadDetails?.isTobaccoUser === true ? "Yes" : leadDetails?.isTobaccoUser === false ? "No" : null,
                gender: leadDetails?.gender,
            });
        }
    }, [leadDetails, leadId]);

    const onSubmitHandler = useCallback(
        async (values, { setSubmitting }) => {
            const formData = {
                birthdate: values?.dateOfBirth ? formatDate(values.dateOfBirth) : "",
                height: values.feet ? Number(values.feet * 12) + Number(values.inches) : null,
                weight: values.weight ? values.weight : null,
                isTobaccoUser: values.isTobaccoUser === "Yes",
                gender: values.gender,
            };

            const payload = formatPayload(leadDetails, formData);

            try {
                const response = await updateLeadDetails(payload);
                if (response) {
                    fireEvent("New Quote Created With Instant Quote", {
                        leadId: leadDetails?.leadsId,
                        line_of_business: "Life",
                        contactType: isContactType,
                    });
                    if (isSimplifiedIUL()) {
                        navigate(`/simplified-iul/plans/${leadId}`, { replace: true, state: { from: loc?.pathname } });
                    } else {
                        navigate(`/finalexpenses/plans/${leadId}`, {
                            replace: true,
                            state: { from: loc?.pathname },
                        });
                    }
                    handleClose();
                }
            } catch (error) {
                console.error("Error while submitting the form", error);
            } finally {
                setSubmitting(false);
            }
        },
        [leadDetails, updateLeadDetails, handleClose, fireEvent, isContactType, navigate, leadId, isSimplifiedIUL],
    );

    const ErrorInfoIcon = () => (
        <InputAdornment position="end">
            <ErrorIcon style={{ color: "red" }} />
        </InputAdornment>
    );

    const HelpText = ({ text }) => (
        <Typography variant="body2" className={styles.helpText}>
            {text}
        </Typography>
    );

    const formik = useFormik({
        initialValues,
        validationSchema: FinalExpenseIntakeForm,
        enableReinitialize: true,
        onSubmit: onSubmitHandler,
    });

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = formik;

    const areAllValuesPresent = useMemo(() => {
        const allValuesPresent = values?.dateOfBirth && values?.isTobaccoUser && values?.stateCode && values?.gender;
        return allValuesPresent;
    }, [values]);

    return (
        <WithLoader isLoading={isLoadingLeadDetails}>
            <Box className={styles.formContainer}>
                <Typography variant="h3" className={styles.header}>
                    Let’s confirm a few details.
                </Typography>
                <Typography variant="h3" className={styles.subHeader}>
                    Please add Zip Code to get a quote.
                </Typography>
                <Box className={styles.formContent}>
                    <Grid container className={styles.gridContainer}>
                        <Grid item md={6} xs={6}>
                            <Box className={styles.inputLabel}>State*</Box>
                            <SelectStateField
                                value={values.stateCode}
                                onChange={(value) => {
                                    setFieldValue("stateCode", value);
                                    sessionStorage.setItem(leadId, JSON.stringify({ stateCode: value }));
                                }}
                                selectContainerClassName={styles.selectInputBox}
                                inputBoxClassName={styles.inputBoxClassName}
                                className={styles.stateSelect}
                            />
                        </Grid>
                        <Grid item md={5} xs={5}>
                            <SelectableButtonGroup
                                labelText="Gender*"
                                selectedButtonText={values.gender}
                                buttonOptions={["Male", "Female"]}
                                onSelect={(value) => setFieldValue("gender", value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container className={styles.gridContainer}>
                        <Grid item md={6} xs={6}>
                            <Box className={styles.heightContainer}>
                                <TextInput
                                    name="feet"
                                    type="number"
                                    value={values.feet}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.feet && Boolean(errors.feet)}
                                    fullWidth
                                    label="Height"
                                    size="medium"
                                    helperText={touched.feet && errors.feet}
                                    InputProps={{
                                        inputProps: {
                                            maxLength: 1,
                                        },
                                        endAdornment:
                                            touched.feet && Boolean(errors.feet) ? (
                                                <ErrorInfoIcon />
                                            ) : (
                                                <HelpText text="ft" />
                                            ),
                                    }}
                                />
                                <TextInput
                                    name="inches"
                                    type="number"
                                    value={values.inches}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.inches && Boolean(errors.inches)}
                                    fullWidth
                                    size="medium"
                                    helperText={touched.inches && errors.inches}
                                    InputProps={{
                                        inputProps: {
                                            maxLength: 2,
                                        },
                                        endAdornment:
                                            touched.inches && Boolean(errors.inches) ? (
                                                <ErrorInfoIcon />
                                            ) : (
                                                <HelpText text="in" />
                                            ),
                                    }}
                                    marginTop={"20px"}
                                />
                            </Box>
                        </Grid>
                        <Grid item md={5} xs={5}>
                            <TextInput
                                name="weight"
                                type="number"
                                value={values.weight}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.weight && Boolean(errors.weight)}
                                fullWidth
                                label="Weight"
                                size="medium"
                                helperText={touched.weight && errors.weight}
                                InputProps={{
                                    inputProps: {
                                        maxLength: 3,
                                    },
                                    endAdornment:
                                        touched.weight && Boolean(errors.weight) ? (
                                            <ErrorInfoIcon />
                                        ) : (
                                            <HelpText text="lbs" />
                                        ),
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container className={styles.gridContainer}>
                        <Grid item md={6} xs={6}>
                            <Box className={styles.inputLabel}>Date of Birth*</Box>
                            <DatePickerMUI
                                value={values.dateOfBirth}
                                disableFuture
                                onChange={(value) => setFieldValue("dateOfBirth", value)}
                                className={styles.datepicker}
                                iconPosition="left"
                            />
                        </Grid>
                        <Grid item md={5} xs={5}>
                            <SelectableButtonGroup
                                labelText="Tobacco Use*"
                                selectedButtonText={values.isTobaccoUser}
                                buttonOptions={["Yes", "No"]}
                                onSelect={(value) => setFieldValue("isTobaccoUser", value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Typography className={styles.requiredFieldsNote}>*Required fields</Typography>
            <Box className={styles.submitButtonContainer}>
                <Button
                    onClick={handleSubmit}
                    size="medium"
                    variant="contained"
                    color="primary"
                    disabled={!areAllValuesPresent}
                    endIcon={<ButtonCircleArrow />}
                >
                    Continue
                </Button>
            </Box>
        </WithLoader>
    );
};

FinalExpenseIntakeFormCard.propTypes = {
    text: PropTypes.string.isRequired,
};

export default FinalExpenseIntakeFormCard;
