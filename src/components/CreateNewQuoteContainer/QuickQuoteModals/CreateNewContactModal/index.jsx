import { useCallback, useState } from "react";
import { Box, Typography, InputAdornment, Grid } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

import { TextInput, CustomModal } from "components/MuiComponents";
import { useCreateNewQuote } from "providers/CreateNewQuote";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";
import useAnalytics from "hooks/useAnalytics";
import { useFormik } from "formik";
import { LeadDetails } from "schemas";
import styles from "./styles.module.scss";
import ContinueIcon from "components/icons/Continue";
import CommunicationInputsGroup from "components/ContactForm/CommunicationInputsGroup";

const CreateNewContactModal = () => {
    const {
        createNewContactModalOpen: open,
        setCreateNewContactModalOpen: handleClose,
        newLeadDetails,
        handleSelectedLead,
    } = useCreateNewQuote();
    const { fireEvent } = useAnalytics();
    const { clientsService } = useClientServiceContext();
    const showToast = useToast();

    const [isEmailDeliverable, setIsEmailDeliverable] = useState(false);

    const isDuplicateContact = useCallback(
        async (values) => {
            const response = await clientsService.getDuplicateContact(values);
            if (response?.ok) {
                const resMessage = await response.json();

                if (resMessage?.isExactDuplicate) {
                    return {
                        firstName: "Duplicate Contact",
                        lastName: "Duplicate Contact",
                        isExactDuplicate: true,
                    };
                } else {
                    return {
                        isExactDuplicate: false,
                    };
                }
            } else {
                showToast({
                    message: "Issue while checking for duplicate contact",
                    type: "error",
                });

                return {
                    isExactDuplicate: false,
                };
            }
        },
        [clientsService, showToast]
    );

    const onSubmitHandler = useCallback(
        async (values, { setErrors, setSubmitting }) => {
            try {
                setSubmitting(true);

                if (values?.phone || values?.email) {
                    const newData = {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: isEmailDeliverable ? values.email : "",
                        phones: {
                            leadPhone: values?.phone || "",
                            phoneLabel: "mobile",
                        },
                    };

                    const duplicateCheckResult = await isDuplicateContact(newData);

                    if (duplicateCheckResult?.isExactDuplicate) {
                        setErrors({
                            firstName: "Duplicate Contact",
                            lastName: "Duplicate Contact",
                        });

                        setSubmitting(false);
                        return;
                    }

                    const response = await clientsService.addNewContact(newData);

                    if (response.ok) {
                        const resData = await response.json();
                        handleSelectedLead(resData);
                        fireEvent("New Contact Created With Quote Quote");
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
        [clientsService, fireEvent, handleSelectedLead, showToast]
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

    const { values, errors, isValid, dirty, handleChange, handleBlur, handleSubmit, isSubmitting } = formik;

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
            isSaveButtonDisabled={!isValid || !dirty || isSubmitting}
            maxWidth="sm"
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
                            error={Boolean(errors.firstName)}
                            fullWidth
                            label="First Name"
                            size="small"
                            helperText={errors.firstName}
                            InputProps={{
                                endAdornment: Boolean(errors.firstName) && <ErrorInfoIcon />,
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
                            error={Boolean(errors?.lastName)}
                            fullWidth
                            label="Last Name"
                            size="small"
                            helperText={errors?.lastName}
                            InputProps={{
                                endAdornment: Boolean(errors?.lastName) && <ErrorInfoIcon />,
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
                <Grid container spacing={2} display={"flex"} flexDirection="row-reverse">
                    <CommunicationInputsGroup
                        formik={formik}
                        page="quickQuote"
                        setIsEmailDeliverable={setIsEmailDeliverable}
                    />
                </Grid>
            </Box>

            <Typography className={styles.requiredFieldNote} sx={{ marginTop: "14px" }}>
                *At least one field required
            </Typography>
        </CustomModal>
    );
};

export default CreateNewContactModal;