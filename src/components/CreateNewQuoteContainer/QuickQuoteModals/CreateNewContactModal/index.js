import { useCallback } from "react";
import { Box, Typography, InputAdornment, Grid } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import { TextInput, CustomModal } from "components/MuiComponents";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";

import { useFormik } from "formik";
import { LeadDetails } from "schemas";
import { formatPhoneNumber } from "utils/formatPhoneNumber";
import styles from "./styles.module.scss";
import ContinueIcon from "components/icons/Continue";

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

                    if (response.ok) {
                        const resData = await response.json();
                        handleSelectedLead(resData);
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
        [clientsService, handleSelectedLead, showToast]
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

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = formik;

    const handlePhoneChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setFieldValue("phone", formattedPhoneNumber);
    };

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
            shouldShowCancelButton={true}
            maxWidth="md"
            disableContentBackground
            saveLabel="Continue"
            footerActionIcon={<ContinueIcon />}
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
                            error={touched.firstName && Boolean(errors.firstName)}
                            fullWidth
                            label="First Name"
                            size="small"
                            helperText={touched.firstName && errors.firstName}
                            InputProps={{
                                endAdornment: touched.firstName && Boolean(errors.firstName) && <ErrorInfoIcon />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextInput
                            name="lastName"
                            value={values.lastName}
                            placeholder="Enter your last name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && Boolean(errors.lastName)}
                            fullWidth
                            label="Last Name"
                            size="small"
                            helperText={touched.lastName && errors.lastName}
                            InputProps={{
                                endAdornment: touched.lastName && Boolean(errors.lastName) && <ErrorInfoIcon />,
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
                            onChange={handlePhoneChange}
                            onBlur={handleBlur}
                            error={touched.phone && Boolean(errors.phone)}
                            fullWidth
                            label="Phone"
                            type="tel"
                            placeholder="(___) ___-____"
                            size="small"
                            helperText={touched.phone && errors.phone}
                            InputProps={{
                                inputProps: {
                                    maxLength: 14,
                                },
                                endAdornment: touched.phone && Boolean(errors.phone) && <ErrorInfoIcon />,
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
                            error={touched.email && Boolean(errors.email)}
                            fullWidth
                            label="Email"
                            size="small"
                            helperText={touched.email && errors.email}
                            InputProps={{
                                endAdornment: touched.email && Boolean(errors.email) && <ErrorInfoIcon />,
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
