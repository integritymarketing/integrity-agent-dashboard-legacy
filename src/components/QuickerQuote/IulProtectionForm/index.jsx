import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Stack, Box, Button, Typography } from '@mui/material';
import {
  HEALTH_CLASSIFICATION_NON_SMOKER_OPTS,
  HEALTH_CLASSIFICATION_SMOKER_OPTS,
  IUL_PROTECTION_ILLUSTRATED_RATE_OPTS,
  IUL_PROTECTION_PAY_PERIOD_OPTS,
  LIFE_FORM_TYPES,
  PRODUCT_SOLVES_OPTS,
} from 'components/LifeForms/LifeForm.constants';
import styles from './styles.module.scss';
import CounterInput from 'components/LifeForms/common/CounterInput';
import CustomFieldContainer from 'components/LifeForms/common/CustomFieldContainer/CustomFieldContainer';
import CustomRadioGroupOption from 'components/LifeForms/common/CustomRadioGroupOption/CustomRadioGroupOption';
import { Formik } from 'formik';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';
import { IulProtectionProductPreferenceFormSchema } from 'schemas/IulProtectionProductPreferenceFormSchema';
import { useNavigate } from 'react-router-dom';
import { useCreateNewQuote } from 'providers/CreateNewQuote';
import { getBirthDateFromAge } from 'utils/dates';

const IulProtectionForm = () => {
  const formData = {
    payPeriods: '0',
    solves: '$1CSVAtAge121',
    illustratedRate: '5',
    healthClasses: '',
    faceAmounts: '',
    faceAmounts2: '',
    faceAmounts3: '',
  };

  const { handleClose, quickQuoteLeadId, quickQuoteLeadDetails } =
    useCreateNewQuote();
  const navigate = useNavigate();

  const handleSubmitData = useCallback(
    value => {
      const {
        healthClasses,
        faceAmounts,
        faceAmounts2,
        faceAmounts3,
        payPeriods,
        illustratedRate,
        solves,
      } = value;

      const sessionData = {
        birthDate: quickQuoteLeadDetails?.birthdate
          ? quickQuoteLeadDetails?.birthdate
          : getBirthDateFromAge(quickQuoteLeadDetails?.age),
        isTobaccoUser: quickQuoteLeadDetails?.isTobaccoUser,
        gender: quickQuoteLeadDetails?.gender === 'female' ? 'F' : 'M',
        healthClasses: healthClasses,
        state: quickQuoteLeadDetails?.stateCode,
        faceAmounts: [
          String(faceAmounts),
          String(faceAmounts2),
          String(faceAmounts3),
        ],
        payPeriods: payPeriods,
        illustratedRate: illustratedRate,
        solves: solves,
      };

      sessionStorage.setItem(
        'lifeQuoteProtectionDetails',
        JSON.stringify(sessionData)
      );
      navigate(
        `/life/iul-protection/${quickQuoteLeadId}/quote?quick-quote=true`
      );
      handleClose();
    },
    [quickQuoteLeadDetails, navigate, quickQuoteLeadId, handleClose]
  );

  const HEALTH_CLASSIFICATION_OPTS = useMemo(() => {
    return quickQuoteLeadDetails?.isTobaccoUser
      ? HEALTH_CLASSIFICATION_SMOKER_OPTS
      : HEALTH_CLASSIFICATION_NON_SMOKER_OPTS;
  }, [quickQuoteLeadDetails]);

  return (
    <Formik
      initialValues={{
        ...formData,
        healthClasses: quickQuoteLeadDetails?.isTobaccoUser ? 'TP' : 'S',
      }}
      validateOnMount={true}
      enableReinitialize={true}
      validationSchema={IulProtectionProductPreferenceFormSchema}
      onSubmit={values => {
        handleSubmitData(values);
      }}
    >
      {({
        values,
        errors,
        isValid,
        dirty,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
      }) => {
        return (
          <>
            <Box className={styles.iulProtectionForm}>
              <Typography variant='h3' color='#052A63' marginBottom='4px'>
                Set your product preferences.
              </Typography>
              <Typography variant='body1' color='#434A51' marginBottom={4}>
                Just a few quick and easy questions to get your quote
              </Typography>
              <Grid
                container
                direction={'row'}
                rowSpacing={2}
                columnSpacing={{ xs: 0, md: 3 }}
                style={{}}
              >
                <Grid item md={12} xs={12}>
                  <CustomFieldContainer
                    label='Death Benefits*'
                    error={touched.faceAmounts && errors.faceAmounts}
                    style={{ height: '100%' }}
                  >
                    <Stack
                      flex
                      alignItems={'stretch'}
                      flexGrow={1}
                      justifyContent='center'
                      gap={1}
                    >
                      <CounterInput
                        onValueChange={value => {
                          setFieldTouched('faceAmounts', true);
                          setFieldValue('faceAmounts', value);
                        }}
                        min={100000}
                        max={2000000}
                        initialValue={0}
                        incrementOrDecrementValue={10000}
                        initialIncrementValue={100000}
                      />
                    </Stack>
                  </CustomFieldContainer>
                </Grid>
                <Grid item md={12} xs={12} display={'flex'}>
                  <CustomFieldContainer
                    label='Health Classification*'
                    error={touched.healthClasses && errors.healthClasses}
                  >
                    <Grid item xs={12} container spacing={1}>
                      {HEALTH_CLASSIFICATION_OPTS.map((option, index) => {
                        return (
                          <Grid
                            item
                            md={HEALTH_CLASSIFICATION_OPTS.length > 1 ? 6 : 12}
                            xs={6}
                            display={'flex'}
                            key={index}
                          >
                            <CustomRadioGroupOption
                              name='healthClasses'
                              value={option.value}
                              label={option.label}
                              stateValue={values.healthClasses}
                              onChange={handleChange}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CustomFieldContainer>
                </Grid>
                <Grid item md={12} xs={12}>
                  <CustomFieldContainer
                    label={
                      <span className={styles.payPeriodLabel}>Pay Period*</span>
                    }
                  >
                    <Grid item xs={12} container spacing={1}>
                      {IUL_PROTECTION_PAY_PERIOD_OPTS.map((option, index) => {
                        return (
                          <Grid
                            item
                            md={12}
                            xs={12}
                            className={styles.radioOptionGrid}
                            key={index}
                          >
                            <CustomRadioGroupOption
                              name='payPeriods'
                              value={option.value}
                              label={option.label}
                              stateValue={values.payPeriods}
                              onChange={handleChange}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CustomFieldContainer>
                </Grid>
                <Grid item md={12} xs={12}>
                  <CustomFieldContainer label='Product Solves*'>
                    <Grid item xs={12} container spacing={1}>
                      {PRODUCT_SOLVES_OPTS.map((option, index) => {
                        return (
                          <Grid
                            item
                            md={12}
                            xs={12}
                            className={styles.radioOptionGrid}
                            key={index}
                          >
                            <CustomRadioGroupOption
                              name='solves'
                              value={option.value}
                              label={option.label}
                              stateValue={values.solves}
                              onChange={handleChange}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CustomFieldContainer>
                </Grid>
                <Grid item md={12} xs={12}>
                  <CustomFieldContainer label='Illustrated Rate*'>
                    <Grid item xs={12} container spacing={1}>
                      {IUL_PROTECTION_ILLUSTRATED_RATE_OPTS.map(
                        (option, index) => {
                          return (
                            <Grid
                              item
                              md={6}
                              xs={6}
                              className={styles.radioOptionGrid}
                              key={index}
                            >
                              <CustomRadioGroupOption
                                name='illustratedRate'
                                value={option.value}
                                label={option.label}
                                stateValue={values.illustratedRate}
                                onChange={handleChange}
                              />
                            </Grid>
                          );
                        }
                      )}
                    </Grid>
                  </CustomFieldContainer>
                </Grid>
              </Grid>
            </Box>
            <div className={styles.requiredFieldLabel}>*Required fields</div>

            <Box className={styles.buttonContainer}>
              <Button
                onClick={handleSubmit}
                size='medium'
                variant='contained'
                color='primary'
                disabled={!isValid || !dirty}
                endIcon={<ButtonCircleArrow />}
              >
                Continue
              </Button>
            </Box>
          </>
        );
      }}
    </Formik>
  );
};

IulProtectionForm.propTypes = {
  contactId: PropTypes.string.isRequired,
  quoteType: PropTypes.oneOf([
    LIFE_FORM_TYPES.IUL_ACCUMULATION,
    LIFE_FORM_TYPES.IUL_PROTECTION,
    LIFE_FORM_TYPES.TERM,
  ]),
};

export default IulProtectionForm;
