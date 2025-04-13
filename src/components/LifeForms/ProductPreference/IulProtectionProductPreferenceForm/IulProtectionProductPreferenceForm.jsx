import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Stack } from '@mui/material';
import {
  HEALTH_CLASSIFICATION_NON_SMOKER_OPTS,
  HEALTH_CLASSIFICATION_SMOKER_OPTS,
  IUL_PROTECTION_ILLUSTRATED_RATE_OPTS,
  IUL_PROTECTION_PAY_PERIOD_OPTS,
  LIFE_FORM_TYPES,
  PRODUCT_SOLVES_OPTS,
} from 'components/LifeForms/LifeForm.constants';
import styles from './IulProtectionProductPreferenceForm.module.scss';
import CounterInput from 'components/LifeForms/common/CounterInput';
import CustomFieldContainer from 'components/LifeForms/common/CustomFieldContainer/CustomFieldContainer';
import CustomRadioGroupOption from 'components/LifeForms/common/CustomRadioGroupOption/CustomRadioGroupOption';
import { Formik } from 'formik';
import FullWidthButton from 'components/ui/FullWidthButton';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';
import { useLeadDetails } from 'providers/ContactDetails';
import { IulProtectionProductPreferenceFormSchema } from 'schemas/IulProtectionProductPreferenceFormSchema';
import { useNavigate } from 'react-router-dom';

export const IulProtectionProductPreferenceForm = ({ quoteType }) => {
  const [formData, setFormData] = useState({
    payPeriods: '0',
    solves: '$1CSVAtAge121',
    illustratedRate: '5',
    healthClasses: 'S',
    faceAmounts: '',
    faceAmounts2: '',
    faceAmounts3: '',
  });

  const { leadDetails } = useLeadDetails();
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

      const sessionItem = sessionStorage.getItem(leadDetails?.leadsId);
      const stateCode = sessionItem
        ? JSON.parse(sessionItem).stateCode
        : leadDetails?.addresses && leadDetails?.addresses[0];
      const sessionData = {
        birthDate: leadDetails?.birthdate,
        isTobaccoUser: leadDetails?.isTobaccoUser,
        gender: leadDetails?.gender === 'female' ? 'F' : 'M',
        healthClasses: healthClasses,
        state: stateCode,
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
      navigate(`/life/iul-protection/${leadDetails?.leadsId}/quote`);
    },
    [leadDetails, navigate]
  );

  const HEALTH_CLASSIFICATION_OPTS = leadDetails?.isTobaccoUser
    ? HEALTH_CLASSIFICATION_SMOKER_OPTS
    : HEALTH_CLASSIFICATION_NON_SMOKER_OPTS;
  return (
    <Formik
      initialValues={formData}
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
            <Grid
              container
              direction={'row'}
              rowSpacing={2}
              columnSpacing={{ xs: 0, md: 3 }}
              style={{}}
            >
              <Grid item md={6} xs={12}>
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
                      min={2000}
                      max={2000000}
                      initialValue={0}
                      incrementOrDecrementValue={10000}
                      initialIncrementValue={2000}
                    />
                    <CounterInput
                      onValueChange={value => {
                        setFieldTouched('faceAmounts2', true);
                        setFieldValue('faceAmounts2', value);
                      }}
                      min={2000}
                      max={2000000}
                      initialValue={0}
                      incrementOrDecrementValue={10000}
                      initialIncrementValue={2000}
                    />
                    <CounterInput
                      onValueChange={value => {
                        setFieldTouched('faceAmount3', true);
                        setFieldValue('faceAmounts3', value);
                      }}
                      min={2000}
                      max={2000000}
                      initialValue={0}
                      incrementOrDecrementValue={10000}
                      initialIncrementValue={2000}
                    />
                  </Stack>
                </CustomFieldContainer>
              </Grid>
              <Grid item md={6} xs={12} display={'flex'}>
                <CustomFieldContainer
                  label='Health Classification*'
                  error={touched.healthClasses && errors.healthClasses}
                >
                  <Grid item xs={12} container spacing={1}>
                    {HEALTH_CLASSIFICATION_OPTS.map((option, index) => {
                      if (
                        leadDetails?.isTobaccoUser &&
                        values.healthClasses !== option.value
                      ) {
                        setFieldValue('healthClasses', option.value, true);
                        setFieldTouched('healthClasses', true, true);
                      }
                      return (
                        <Grid
                          item
                          md={24 / HEALTH_CLASSIFICATION_OPTS.length}
                          xs={6}
                          display={'flex'}
                          key={index}
                        >
                          <CustomRadioGroupOption
                            name='healthClasses'
                            value={option.value}
                            label={option.label}
                            stateValue={values.healthClasses}
                            onChange={e => {
                              setFieldTouched('healthClasses', true);
                              handleChange(e);
                            }}
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
                          md={4}
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
              <Grid item md={6} xs={12}>
                <CustomFieldContainer label='Product Solves*'>
                  <Grid item xs={12} container spacing={1}>
                    {PRODUCT_SOLVES_OPTS.map((option, index) => {
                      return (
                        <Grid
                          item
                          md={6}
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
              <Grid item md={6} xs={12}>
                <CustomFieldContainer label='Illustrated Rate*'>
                  <Grid item xs={12} container spacing={1}>
                    {IUL_PROTECTION_ILLUSTRATED_RATE_OPTS.map(
                      (option, index) => {
                        return (
                          <Grid
                            item
                            md={3}
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
            <Stack flex>
              <FullWidthButton
                disabled={!isValid || !dirty}
                label='Continue to Quote'
                type='primary'
                onClick={() => {
                  handleSubmit();
                }}
                icon={<ButtonCircleArrow />}
                iconPosition='right'
                style={{ border: 'none', justifyContent: 'space-between' }}
                className={styles.nextButton}
              />
            </Stack>
          </>
        );
      }}
    </Formik>
  );
};

IulProtectionProductPreferenceForm.propTypes = {
  contactId: PropTypes.string.isRequired,
  quoteType: PropTypes.oneOf([
    LIFE_FORM_TYPES.IUL_ACCUMULATION,
    LIFE_FORM_TYPES.IUL_PROTECTION,
    LIFE_FORM_TYPES.TERM,
  ]),
};
