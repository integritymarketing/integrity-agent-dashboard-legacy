import { useCallback } from "react";
import { Box, Typography, InputAdornment, Grid } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import { TextInput, CustomModal } from "components/MuiComponents";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";

import { useFormik } from "formik";
import { LeadDetails } from "schemas";
import styles from "./styles.module.scss";

const CreateNewContactModal = () => {
    const {
        createNewContactModalOpen: open,
        setCreateNewContactModalOpen: handleClose,
        newLeadDetails,
        handleSelectedLead,
    } = useCreateNewQuote();

    const { clientsService } = useClientServiceContext();
    const showToast = useToast();

    const onSubmitHandler = useCallback(
        async (values, { setSubmitting }) => {
            try {
                setSubmitting(true);

                if (values?.phone || values?.email) {
                    const newData = {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values?.email,
                        phones: {
                            leadPhone: values?.phone || "",
                            phoneLabel: "mobile",
                        },
                    };

                    const response = await clientsService.addNewContact(newData);

                    if (response.status >= 200 && response.status < 300) {
                        handleSelectedLead(response.data);
                        showToast({
                            type: "success",
                            message: "Lead Created successfully",
                            time: 10000,
                        });
                    } else {
                        showToast({
                            type: "error",
                            message: "An error occurred while creating lead. Please try again.",
                        });
                    }
                } else {
                    showToast({
                        type: "error",
                        message: "Either Phone or Email is required",
                    });
                }
            } catch (error) {
                showToast({
                    type: "error",
                    message: "An error occurred while creating lead. Please try again.",
                });
            } finally {
                setSubmitting(false);
            }
        },
        [newLeadDetails, clientsService, showToast]
    );

    const ErrorInfoIcon = () => (
        <InputAdornment position="end">
            <ErrorIcon style={{ color: "red" }} />
        </InputAdornment>
    );

    const formik = useFormik({
        initialValues: newLeadDetails,
        validationSchema: LeadDetails,
        enableReinitialize: true,
        onSubmit: onSubmitHandler,
    });

    const { values, errors, touched, isValid, dirty, handleChange, handleBlur, handleSubmit } = formik;

    const onClose = () => {
        handleClose(false);
    };

    return (
        <CustomModal
            title={"Start a Quote"}
            open={open}
            handleClose={onClose}
            footer
            handleSave={handleSubmit}
            showCloseButton
            // isSaveButtonDisabled={!dirty || !isValid}
            shouldShowCancelButton={true}
            maxWidth="sm"
            disableContentBackground
            saveLabel="Continue"
        >
            <Box className={styles.modalSection}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            name="firstName"
                            value={values.firstName}
                            placeholder="Enter your first name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.firstName && !!errors.firstName}
                            fullWidth
                            label="First Name"
                            size="small"
                            helperText={touched.firstName && errors.firstName}
                            InputProps={{
                                endAdornment: touched.firstName && !!errors.firstName && <ErrorInfoIcon />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            name="lastName"
                            value={values.lastName}
                            placeholder="Enter your first name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && !!errors.lastName}
                            fullWidth
                            label="Last Name"
                            size="small"
                            helperText={touched.lastName && errors.lastName}
                            InputProps={{
                                endAdornment: touched.lastName && !!errors.lastName && <ErrorInfoIcon />,
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box className={styles.modalSection} marginTop={"16px"}>
                <Box>
                    <Typography variant="h3" className={styles.sectionTitle}>
                        Contact Details
                    </Typography>
                    <Typography variant="body1" className={styles.sectionSubtitle}>
                        Please add one of the following in order to create your contact.
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.phone && !!errors.phone}
                            fullWidth
                            label="Phone*"
                            type="tel"
                            placeholder="XXX-XXX-XXXX"
                            size="small"
                            helperText={touched.phone && errors.phone}
                            InputProps={{
                                inputProps: {
                                    maxLength: 10,
                                },
                                endAdornment: touched.phone && !!errors.phone && <ErrorInfoIcon />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            name="email"
                            value={values.email}
                            placeholder="Enter your email address"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && !!errors.email}
                            fullWidth
                            label="Email*"
                            size="small"
                            helperText={touched.email && errors.email}
                            InputProps={{
                                endAdornment: touched.email && !!errors.email && <ErrorInfoIcon />,
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Typography className={styles.requiredFieldNote}>*At least one field required</Typography>
        </CustomModal>
    );
};

export default CreateNewContactModal;
