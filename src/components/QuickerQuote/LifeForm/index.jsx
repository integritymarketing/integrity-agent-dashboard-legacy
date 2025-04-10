import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, InputAdornment, Typography } from '@mui/material';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import { SelectStateField } from 'components/SharedFormFields';
import SelectableButtonGroup from 'components/SelectableButtonGroup';
import { formatDate } from 'utils/dates';
import { TextInput } from 'components/MuiComponents';
import DatePickerMUI from 'components/DatePicker';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { QuickQuoteLifeSchema } from 'schemas';
import styles from './styles.module.scss';
import useAnalytics from 'hooks/useAnalytics';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';
import { LIFE_QUESTION_CARD_LIST } from 'components/CreateNewQuoteContainer/QuickQuoteModals/LifeQuestionCard/constants';

const LifeForm = () => {
  const navigate = useNavigate();
  const { fireEvent } = useAnalytics();
  const {
    handleClose,
    quickQuoteLeadId,
    updateQuickQuoteLeadDetails,
    isLoadingQuickQuoteLeadDetails,
    quickQuoteLeadDetails,
    isSimplifiedIUL,
    selectedLifeProductType,
    setQuoteModalStage,
    selectedIulGoal,
  } = useCreateNewQuote();

  const initialValues = {
    stateCode: null,
    gender: null,
    feet: null,
    inches: null,
    weight: null,
    dateOfBirth: null,
    isTobaccoUser: null,
    age: null,
  };

  const onSubmitHandler = useCallback(
    async (values, { setSubmitting }) => {
      setSubmitting(true);
      const formData = {
        birthdate: values?.dateOfBirth ? formatDate(values.dateOfBirth) : '',
        height: values.feet
          ? Number(values.feet * 12) + Number(values.inches)
          : null,
        weight: values.weight ? values.weight : null,
        isTobaccoUser: values.isTobaccoUser === 'Yes',
        gender: values.gender,
        stateCode: values.stateCode,
        age: values.age ? values.age : null,
      };

      const code = JSON.stringify({ stateCode: formData.stateCode });
      sessionStorage.setItem(quickQuoteLeadId, code);

      const payload = {
        ...quickQuoteLeadDetails,
        ...formData,
      };

      try {
        const response = await updateQuickQuoteLeadDetails(payload);
        if (response) {
          if (
            selectedLifeProductType === LIFE_QUESTION_CARD_LIST.FINAL_EXPENSE ||
            selectedLifeProductType ===
              LIFE_QUESTION_CARD_LIST.SIMPLIFIED_INDEXED_UNIVERSAL_LIFE
          ) {
            if (isSimplifiedIUL()) {
              navigate(
                `/simplified-iul/healthconditions/${quickQuoteLeadId}?quick-quote=true`,
                {
                  replace: true,
                }
              );
            } else {
              navigate(
                `/finalexpenses/healthconditions/${quickQuoteLeadId}?quick-quote=true`,
                {
                  replace: true,
                }
              );
            }
            handleClose();
          }
          if (
            selectedLifeProductType ===
            LIFE_QUESTION_CARD_LIST.INDEXED_UNIVERSAL_LIFE
          ) {
            if (selectedIulGoal === 'Accumulation') {
              setQuoteModalStage('IulAccummulationForm');
              return;
            }
            if (selectedIulGoal === 'Protection') {
              setQuoteModalStage('IulProtectionForm');
              return;
            } else {
              handleClose();
            }
          } else {
            handleClose();
          }
        }
      } catch (error) {
        console.error('Error while submitting the form', error);
      } finally {
        setSubmitting(false);
      }
    },
    [
      updateQuickQuoteLeadDetails,
      quickQuoteLeadDetails,
      handleClose,
      fireEvent,
      navigate,
      isSimplifiedIUL,
      quickQuoteLeadId,
      selectedIulGoal,
      setQuoteModalStage,
    ]
  );

  const ErrorInfoIcon = () => (
    <InputAdornment position='end'>
      <ErrorIcon style={{ color: 'red' }} />
    </InputAdornment>
  );

  const HelpText = ({ text }) => (
    <Typography variant='body2' className={styles.helpText}>
      {text}
    </Typography>
  );

  const formik = useFormik({
    initialValues,
    validationSchema: QuickQuoteLifeSchema,
    enableReinitialize: true,
    onSubmit: onSubmitHandler,
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik;

  const areAllValuesPresent = useMemo(() => {
    const allValuesPresent =
      (values?.dateOfBirth || values?.age) &&
      values?.isTobaccoUser &&
      values?.stateCode &&
      values?.gender;
    return allValuesPresent;
  }, [values]);

  return (
    <>
      <Box className={styles.formContainer}>
        <Typography variant='h3' className={styles.header}>
          Let’s confirm a few details.
        </Typography>
        <Typography variant='body1' color='#434A51'>
          Just a few quick and easy questions to get your quote.
        </Typography>
        <Box className={styles.formContent}>
          <Grid container className={styles.gridContainer}>
            <Grid item md={6} xs={12}>
              <Box className={styles.inputLabel}>State*</Box>
              <SelectStateField
                value={values.stateCode}
                onChange={value => {
                  setFieldValue('stateCode', value);
                }}
                selectContainerClassName={styles.selectInputBox}
                inputBoxClassName={styles.inputBoxClassName}
                className={styles.stateSelect}
              />
            </Grid>
            <Grid item md={5.5} xs={12}>
              <SelectableButtonGroup
                labelText='Gender*'
                selectedButtonText={values.gender}
                buttonOptions={['Male', 'Female']}
                onSelect={value => setFieldValue('gender', value)}
              />
            </Grid>
          </Grid>
          <Grid container className={styles.gridContainer}>
            <Grid item md={3.6} xs={8}>
              <Typography variant='h5' color={'#052a63'}>
                Height
              </Typography>
              <Box className={styles.heightContainer}>
                <TextInput
                  name='feet'
                  type='number'
                  value={values.feet}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.feet && Boolean(errors.feet)}
                  fullWidth
                  size='medium'
                  helperText={touched.feet && errors.feet}
                  InputProps={{
                    inputProps: {
                      maxLength: 1,
                    },
                    endAdornment:
                      touched.feet && Boolean(errors.feet) ? (
                        <ErrorInfoIcon />
                      ) : (
                        <HelpText text='ft' />
                      ),
                  }}
                />
                <TextInput
                  name='inches'
                  type='number'
                  value={values.inches}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.inches && Boolean(errors.inches)}
                  fullWidth
                  size='medium'
                  helperText={touched.inches && errors.inches}
                  InputProps={{
                    inputProps: {
                      maxLength: 2,
                    },
                    endAdornment:
                      touched.inches && Boolean(errors.inches) ? (
                        <ErrorInfoIcon />
                      ) : (
                        <HelpText text='in' />
                      ),
                  }}
                />
              </Box>
            </Grid>
            <Grid item md={2} xs={3}>
              <TextInput
                name='weight'
                type='number'
                value={values.weight}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.weight && Boolean(errors.weight)}
                fullWidth
                label='Weight'
                size='medium'
                helperText={touched.weight && errors.weight}
                InputProps={{
                  inputProps: {
                    maxLength: 3,
                  },
                  endAdornment:
                    touched.weight && Boolean(errors.weight) ? (
                      <ErrorInfoIcon />
                    ) : (
                      <HelpText text='lbs' />
                    ),
                }}
              />
            </Grid>

            <Grid item md={5.5} xs={12}>
              <SelectableButtonGroup
                labelText='Tobacco Use*'
                selectedButtonText={values.isTobaccoUser}
                buttonOptions={['Yes', 'No']}
                onSelect={value => setFieldValue('isTobaccoUser', value)}
              />
            </Grid>
          </Grid>
          <Grid container className={styles.lastRowContainer}>
            <Grid item md={5.8} xs={12}>
              <Box className={styles.inputLabel}>Date of Birth*</Box>
              <Box sx={{ cursor: !!values.age ? 'not-allowed' : 'auto' }}>
                <DatePickerMUI
                  value={values.dateOfBirth}
                  disableFuture
                  onChange={value => setFieldValue('dateOfBirth', value)}
                  className={styles.datepicker}
                  iconPosition='left'
                  disabled={!!values.age}
                />
              </Box>
            </Grid>

            <Typography variant='body1' color='#434A51' marginTop={2}>
              or
            </Typography>

            <Grid item md={5.4} xs={12}>
              <Box
                sx={{ cursor: !!values.dateOfBirth ? 'not-allowed' : 'auto' }}
              >
                <TextInput
                  name='age'
                  type='number'
                  value={values.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  label='Age'
                  size='medium'
                  helperText={touched.email && errors.email}
                  disabled={!!values.dateOfBirth}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Typography variant='body2' color='#717171' marginTop={1}>
        *Required fields, include date of birth for more accurate results.
      </Typography>
      <Box className={styles.submitButtonContainer}>
        <Button
          onClick={handleSubmit}
          size='medium'
          variant='contained'
          color='primary'
          disabled={!areAllValuesPresent || isLoadingQuickQuoteLeadDetails}
          endIcon={<ButtonCircleArrow />}
        >
          {isLoadingQuickQuoteLeadDetails ? 'Loading...' : 'Continue'}
        </Button>
      </Box>
    </>
  );
};

LifeForm.propTypes = {
  text: PropTypes.string.isRequired,
};

export default LifeForm;
