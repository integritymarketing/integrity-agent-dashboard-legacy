import { useCallback, useMemo, useState } from 'react';
import { Box, Typography, InputAdornment, Grid } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { TextInput, CustomModal } from 'components/MuiComponents';
import useToast from 'hooks/useToast';
import useAnalytics from 'hooks/useAnalytics';
import { useFormik } from 'formik';
import { LeadDetails } from 'schemas';
import styles from './styles.module.scss';
import ContinueIcon from 'components/icons/Continue';
import CommunicationInputsGroup from 'components/ContactForm/CommunicationInputsGroup';

const CreateContactForm = ({
  open,
  handleClose,
  newLeadDetails,
  handleSaveNewContact,
  isLoadingQuickQuoteLeadDetails,
}) => {
  const { fireEvent } = useAnalytics();
  const showToast = useToast();

  const [isEmailDeliverable, setIsEmailDeliverable] = useState(false);

  const onSubmitHandler = useCallback(
    (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        if (values?.phones?.leadPhone || values?.email) {
          const newData = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: isEmailDeliverable ? values.email : '',
            phone: values?.phones?.leadPhone || '',
            primaryCommunication: values.primaryCommunication,
          };

          handleSaveNewContact(newData);
        } else {
          showToast({
            type: 'error',
            message: 'Either Phone or Email is required',
          });
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: 'An error occurred while creating lead. Please try again.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [fireEvent, showToast, isEmailDeliverable, handleSaveNewContact]
  );

  const ErrorInfoIcon = () => (
    <InputAdornment position='end'>
      <ErrorIcon style={{ color: 'red' }} />
    </InputAdornment>
  );

  const formik = useFormik({
    initialValues: newLeadDetails,
    validationSchema: LeadDetails,
    enableReinitialize: true,
    onSubmit: onSubmitHandler,
  });

  const {
    values,
    errors,
    isValid,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = formik;

  const onClose = () => {
    handleClose(false);
  };

  const isPhoneorEmailValid = useMemo(() => {
    if (
      values?.email &&
      values?.primaryCommunication === 'email' &&
      isEmailDeliverable
    ) {
      const emailPattern = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;
      return emailPattern.test(values.email);
    }
    if (values?.phones?.leadPhone && values?.primaryCommunication === 'phone') {
      const digitsOnly = values?.phones?.leadPhone.replace(/\D/g, '');
      return digitsOnly.length === 10;
    }
    if (
      values?.email &&
      values?.primaryCommunication === 'email' &&
      !isEmailDeliverable
    ) {
      const digitsOnly = values?.phones?.leadPhone.replace(/\D/g, '');

      if (values?.phones?.leadPhone && digitsOnly.length === 10) {
        setFieldValue('primaryCommunication', 'phone');
        return true;
      }
    }
    return false;
  }, [values, isEmailDeliverable, setFieldValue]);

  const formValid = useMemo(() => {
    return isValid && dirty && isPhoneorEmailValid && !isSubmitting;
  }, [isValid, dirty, isPhoneorEmailValid, isSubmitting]);

  return (
    <CustomModal
      title={'Create or Link a Contact'}
      open={open}
      handleClose={onClose}
      footer
      handleSave={handleSubmit}
      showCloseButton
      shouldShowCancelButton={true}
      isSaveButtonDisabled={!formValid || isLoadingQuickQuoteLeadDetails}
      maxWidth='sm'
      disableContentBackground
      saveLabel={isLoadingQuickQuoteLeadDetails ? 'Loading...' : 'Apply'}
      footerActionIcon={<ContinueIcon />}
    >
      <Box className={styles.modalSection}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextInput
              name='firstName'
              value={values.firstName}
              placeholder='Enter your first name'
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.firstName)}
              fullWidth
              label='First Name'
              size='small'
              helperText={errors.firstName}
              InputProps={{
                endAdornment: Boolean(errors.firstName) && <ErrorInfoIcon />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              name='lastName'
              value={values.lastName}
              placeholder='Enter your last name'
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors?.lastName)}
              fullWidth
              label='Last Name'
              size='small'
              helperText={errors?.lastName}
              InputProps={{
                endAdornment: Boolean(errors?.lastName) && <ErrorInfoIcon />,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box className={styles.modalSection} marginTop={'16px'}>
        <Box>
          <Typography variant='h3' className={styles.sectionTitle}>
            Contact Details
          </Typography>
          <Typography variant='body1' className={styles.sectionSubtitle}>
            Please add one of the following in order to create your contact.
          </Typography>
        </Box>
        <Grid
          container
          spacing={2}
          display={'flex'}
          flexDirection='row-reverse'
        >
          <CommunicationInputsGroup
            formik={formik}
            page='quickQuote'
            setIsEmailDeliverable={setIsEmailDeliverable}
          />
        </Grid>
      </Box>

      <Typography
        className={styles.requiredFieldNote}
        sx={{ marginTop: '14px' }}
      >
        *At least one field required
      </Typography>
    </CustomModal>
  );
};

export default CreateContactForm;
