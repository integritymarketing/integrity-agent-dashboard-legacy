import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';

import { Form, Formik } from 'formik';
import { useLeadDetails } from 'providers/ContactDetails';

import { formatDate, getLocalDateTime } from 'utils/dates';
import { primaryContactOptions } from 'utils/primaryContact';
import { onlyAlphabets } from 'utils/shared-utils/sharedUtility';

import useToast from 'hooks/useToast';

import DatePickerMUI from 'components/DatePicker';
import { Button } from 'components/ui/Button';
import { Select } from 'components/ui/Select';
import Textfield from 'components/ui/textfield';

import CountyContext from 'contexts/counties';

import { useClientServiceContext } from 'services/clientServiceProvider';
import validationService from 'services/validationService';

import styles from './ContactInfoContainer.module.scss';
import { StyledFormItem } from './StyledComponents';
import {
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';

import Label from '../CommonComponents/Label';
import SectionContainer from '../CommonComponents/SectionContainer';
import { ArrowForwardWithCircle } from '../Icons';
import {
  contactFormMaritalStatusOptions,
  contactFormPrefixOptions,
  contactFormSuffixOptions,
} from 'utils/contactForm';
import CommunicationInputsGroup from 'components/ContactForm/CommunicationInputsGroup';

function ContactInfoForm({ editLeadDetails, setIsEditMode }) {
  const { leadDetails } = useLeadDetails();

  const {
    firstName = '',
    middleName = '',
    lastName = '',
    suffix = '',
    prefix = '',
    maritalStatus = '',
    birthdate,
    emails = [],
    phones = [],
    addresses = [],
    contactPreferences,
    contactRecordType = 'prospect',
    leadsId,
    leadStatusId,
    notes,
    medicareBeneficiaryID,
    partA,
    partB,
    hasMedicAid,
    subsidyLevel,
  } = leadDetails;

  const {
    allCounties = [],
    allStates = [],
    fetchCountyAndState,
    loading: loadingCountyAndState,
  } = useContext(CountyContext);

  const showToast = useToast();
  const { clientsService } = useClientServiceContext();

  // Helper function to extract the first value from an array or return a default value
  const getFirstValue = (array, defaultValue = null) =>
    array.length > 0 ? array[0] : defaultValue;

  // Helper function to extract properties from an object with default values
  const getAddressField = (address, field, defaultValue = '') =>
    address && address[field] ? address[field] : defaultValue;

  const email = getFirstValue(emails, { leadEmail: null }).leadEmail;
  const phoneData = getFirstValue(phones);
  const addressData = getFirstValue(addresses);
  const emailID = getFirstValue(emails, { emailID: 0 }).emailID;

  // Extracting address fields with a helper function
  const city = getAddressField(addressData, 'city');
  const stateCode = getAddressField(addressData, 'stateCode');
  const address1 = getAddressField(addressData, 'address1');
  const address2 = getAddressField(addressData, 'address2');
  const county = getAddressField(addressData, 'county');
  const countyFips = getAddressField(addressData, 'countyFips');
  const postalCode = getAddressField(addressData, 'postalCode');
  const leadAddressId = getAddressField(addressData, 'leadAddressId');
  const phoneId = getAddressField(phoneData, 'phoneId');
  const phone = getAddressField(phoneData, 'leadPhone');
  const phoneLabel = getAddressField(phoneData, 'phoneLabel');

  const isPrimary = contactPreferences?.primary
    ? contactPreferences?.primary
    : 'email';
  const [zipLengthValid, setZipLengthValid] = useState(false);
  const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);
  const [isEmailDeliverable, setIsEmailDeliverable] = useState(false);

  useEffect(() => {
    fetchCountyAndState(postalCode);
  }, [fetchCountyAndState, postalCode]);

  const formatMbiNumber = value => {
    if (!value) {
      return;
    }
    let formattedValue = value.replace(/-/g, '');
    if (formattedValue.length > 4) {
      formattedValue = `${formattedValue.slice(0, 4)}-${formattedValue.slice(
        4
      )}`;
    }
    if (formattedValue.length > 8) {
      formattedValue = `${formattedValue.slice(0, 8)}-${formattedValue.slice(
        8
      )}`;
    }
    return formattedValue.toUpperCase();
  };

  const isDuplicateContact = useCallback(
    async (values, setDuplicateLeadIds) => {
      // if no phone or email, return false else check for duplicate contact
      const response = await clientsService.getDuplicateContact(values);
      if (response?.ok) {
        const resMessage = await response.json();
        // if duplicate contact, show error and return
        if (resMessage?.isExactDuplicate) {
          setDuplicateLeadIds(resMessage?.duplicateLeadIds || []);

          return {
            firstName: 'Duplicate Contact',
            lastName: 'Duplicate Contact',
            isExactDuplicate: true,
          };
        } else {
          setDuplicateLeadIds(resMessage?.duplicateLeadIds || []);

          return {
            isExactDuplicate: false,
          };
        }
      } else {
        showToast({
          message: 'Issue while checking for duplicate contact',
          type: 'error',
        });

        return {
          isExactDuplicate: false,
        };
      }
    },
    [showToast]
  );

  const isZipCodeInvalid = (postalCode, loadingCountyAndState, allStates) => {
    return (
      (postalCode.length === 5 &&
        !loadingCountyAndState &&
        allStates?.length === 0) ||
      (postalCode > 0 && postalCode.length < 5)
    );
  };

  const setCountyAndState = (values, allCounties, allStates, setFieldValue) => {
    const countyName = allCounties[0]?.value;
    const countyFipsName = allCounties[0]?.key;
    const stateCodeName = allStates[0]?.value;

    if (
      allCounties.length === 1 &&
      countyName !== values.address.county &&
      countyFipsName !== values.address.countyFips
    ) {
      setFieldValue('address.county', countyName);
      setFieldValue('address.countyFips', countyFipsName);
    }

    if (allStates.length === 1 && stateCodeName !== values.address.stateCode) {
      setFieldValue('address.stateCode', stateCodeName);
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        suffix: suffix || '',
        prefix: prefix || '',
        email: email,
        birthdate: birthdate ? formatDate(birthdate) : '',
        phones: {
          leadPhone: phone,
          phoneLabel: phoneLabel?.toLowerCase(),
        },
        address: {
          address1: address1,
          address2: address2,
          city: city,
          stateCode: stateCode,
          postalCode: postalCode,
          county: county || '',
          countyFips: countyFips,
        },
        maritalStatus: leadDetails?.maritalStatus || 'Unknown',
        primaryCommunication: isPrimary,
        contactRecordType: contactRecordType?.toLowerCase(),
        emailID,
        leadAddressId,
        phoneId,
        leadStatusId,
        leadsId,
        notes,
        medicareBeneficiaryID: medicareBeneficiaryID
          ? formatMbiNumber(medicareBeneficiaryID)
          : '',
        partA: partA ?? '',
        partB: partB ?? '',
        hasMedicAid,
        subsidyLevel,
      }}
      validate={async values => {
        return validationService.validateMultiple(
          [
            {
              name: 'firstName',
              validator: validationService.validateName,
              args: ['First Name'],
            },
            {
              name: 'lastName',
              validator: validationService.validateName,
              args: ['Last Name'],
            },
            {
              name: 'phones.leadPhone',
              validator: validationService.composeValidator([
                validationService.validateRequiredIf(
                  'phone' === values.primaryCommunication
                ),
                validationService.validatePhone,
              ]),
            },
            {
              name: 'email',
              validator: validationService.composeValidator([
                validationService.validateRequiredIf(
                  'email' === values.primaryCommunication
                ),
                validationService.validateEmail,
              ]),
            },
            {
              name: 'address.postalCode',
              validator: validationService.composeValidator([
                validationService.validatePostalCode,
              ]),
            },
            {
              name: 'address.address1',
              validator: validationService.composeValidator([
                validationService.validateAddress,
              ]),
              args: ['Address'],
            },
            {
              name: 'address.address2',
              validator: validationService.composeValidator([
                validationService.validateAddress,
              ]),
              args: ['Apt, Suite, Unit'],
            },
            {
              name: 'address.city',
              validator: validationService.composeValidator([
                validationService.validateAddress,
              ]),
            },
            {
              name: 'birthdate',
              validator: validationService.validateDateInput,
              args: ['Date of Birth', 'MM/dd/yyyy'],
            },
            {
              name: 'medicareBeneficiaryID',
              validator: validationService.validateMedicalBeneficiaryId,
              args: ['Medicare Beneficiary ID Number'],
            },
          ],
          values
        );
      }}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        const duplicateCheckResult = await isDuplicateContact(
          values,
          setDuplicateLeadIds
        );
        // if duplicate contact, show error and return and don't submit form
        if (
          duplicateCheckResult?.isExactDuplicate &&
          duplicateLeadIds?.length > 1
        ) {
          setErrors({
            firstName: 'Duplicate Contact',
            lastName: 'Duplicate Contact',
          });
          const middleOfPage = document.documentElement.scrollHeight / 3;
          window.scrollTo(0, middleOfPage);
          setSubmitting(false);
          return;
        }

        setSubmitting(true);
        const payload = {
          ...values,
          email: isEmailDeliverable ? values.email : '',
        };
        editLeadDetails(payload);
        setIsEditMode(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        dirty,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => {
        const isInvalidZip = isZipCodeInvalid(
          values.address.postalCode,
          loadingCountyAndState,
          allStates
        );

        // Simplified logic for county and state setting
        setCountyAndState(values, allCounties, allStates, setFieldValue);

        const formik = {
          values,
          handleBlur,
          setFieldValue,
        };

        return (
          <Box>
            <div>
              <Form>
                <SectionContainer>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      First Name
                    </Typography>
                    <Textfield
                      id='contact-fname'
                      placeholder={'Enter first name'}
                      name='firstName'
                      className='hide-field-error'
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.firstName ? true : false}
                    />
                    {touched.firstName && errors.firstName && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        {errors.firstName}
                      </Typography>
                    )}
                  </StyledFormItem>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Middle Initial
                    </Typography>
                    <Textfield
                      id='contact-mname'
                      type='text'
                      placeholder=''
                      maxLength='1'
                      name='middleName'
                      onKeyDown={onlyAlphabets}
                      value={values.middleName?.toUpperCase()}
                      className='custom-mob-w custom-w-px'
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </StyledFormItem>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Last Name
                    </Typography>

                    <Textfield
                      id='contact-lname'
                      placeholder='Enter last name'
                      className='hide-field-error'
                      name='lastName'
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.lastName ? true : false}
                    />
                    {touched.lastName && errors.lastName && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        {errors.lastName}
                      </Typography>
                    )}
                  </StyledFormItem>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Prefix
                    </Typography>

                    <Select
                      // error={isInvalid("state")}
                      options={contactFormPrefixOptions}
                      initialValue={values.prefix}
                      onChange={value => {
                        setFieldValue('prefix', value);
                      }}
                      showValueAlways={true}
                      showEmptyOption={true}
                    />
                  </StyledFormItem>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Suffix
                    </Typography>
                    <Select
                      // error={isInvalid("state")}
                      options={contactFormSuffixOptions}
                      initialValue={values.suffix}
                      onChange={value => {
                        setFieldValue('suffix', value);
                      }}
                      showValueAlways={true}
                      showEmptyOption={true}
                    />
                  </StyledFormItem>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Marital Status
                    </Typography>

                    <Select
                      // error={isInvalid("state")}
                      options={contactFormMaritalStatusOptions}
                      initialValue={values.maritalStatus}
                      onChange={value => {
                        setFieldValue('maritalStatus', value);
                      }}
                      showEmptyOption={true}
                    />
                  </StyledFormItem>
                </SectionContainer>

                <SectionContainer>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Birthdate
                    </Typography>
                    <DatePickerMUI
                      value={values.birthdate}
                      disableFuture={true}
                      onChange={value => {
                        setFieldValue('birthdate', formatDate(value));
                      }}
                    />
                    {errors.birthdate && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        {errors.birthdate}
                      </Typography>
                    )}
                  </StyledFormItem>
                </SectionContainer>

                <SectionContainer>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Primary Contact
                    </Typography>

                    <Select
                      // error={isInvalid("state")}
                      options={primaryContactOptions}
                      placeholder='Phone'
                      initialValue={values.primaryCommunication}
                      onChange={value => {
                        setFieldValue('primaryCommunication', value);
                      }}
                      showValueAlways={true}
                    />
                  </StyledFormItem>

                  {errors.phones?.leadPhone &&
                    values.phones?.leadPhone === '' &&
                    values.primaryCommunication === 'phone' && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        Phone number is required to select as primary
                        communication
                      </Typography>
                    )}

                  {errors.email &&
                    values.email === '' &&
                    values.primaryCommunication === 'email' && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        Email is required to select as primary communication
                      </Typography>
                    )}
                </SectionContainer>
                <SectionContainer>
                  <CommunicationInputsGroup
                    formik={formik}
                    page='overview'
                    defaultEmail={values.email}
                    defaultPhone={values.phones.leadPhone}
                    setIsEmailDeliverable={setIsEmailDeliverable}
                  />
                </SectionContainer>
                <SectionContainer>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Address
                    </Typography>
                    <Textfield
                      id='contact-address'
                      className={`${styles['contact-address']} hide-field-error`}
                      placeholder={'Address Line 1'}
                      name='address.address1'
                      value={values.address.address1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.address?.address1 ? true : false}
                    />
                    {touched.address?.address1 && errors.address?.address1 && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        {errors.address?.address1}
                      </Typography>
                    )}
                  </StyledFormItem>
                  <StyledFormItem>
                    <Textfield
                      id='contact-address2'
                      className={`${styles['contact-address']} hide-field-error`}
                      placeholder={'Enter Apt, Suite, Unit'}
                      name='address.address2'
                      value={values.address.address2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.address?.address2 ? true : false}
                    />
                    {touched.address?.address2 && errors.address?.address2 && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        {errors.address?.address2}
                      </Typography>
                    )}
                  </StyledFormItem>
                  <StyledFormItem>
                    <Textfield
                      id='contact-address__city'
                      className={`${styles['contact-address--city']}  hide-field-error`}
                      placeholder={'Enter City'}
                      name='address.city'
                      value={values.address.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.address?.city ? true : false}
                    />
                    {touched.address?.city && errors.address?.city && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        {errors.address?.city}
                      </Typography>
                    )}
                  </StyledFormItem>
                  <Box
                    className={styles.horizontalLayout}
                    display='flex'
                    justifyContent={'space-between'}
                    gap='10px'
                  >
                    <StyledFormItem>
                      <Textfield
                        id='contact-address__zip'
                        className={`${styles['contact-address--zip']} custom-address-zip hide-field-error`}
                        label=''
                        name='address.postalCode'
                        placeholder='Zip Code'
                        value={values.address.postalCode}
                        inputprops={{ maxLength: 5 }}
                        onChange={e => {
                          setFieldValue('address.postalCode', e.target.value);
                          setFieldValue('address.county', '');
                          setFieldValue('address.stateCode', '');
                          setFieldValue('address.countyFips', '');
                          fetchCountyAndState(e.target.value);
                          if (e.target.value.length < 5) {
                            setZipLengthValid(false);
                          } else {
                            setZipLengthValid(true);
                          }
                        }}
                        onBlur={handleBlur}
                        onInput={e => {
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, '')
                            .toString()
                            .slice(0, 5);
                        }}
                        error={
                          errors.address?.postalCode || isInvalidZip
                            ? true
                            : false
                        }
                      />
                    </StyledFormItem>
                    <StyledFormItem>
                      <Select
                        placeholder='State'
                        showValueAsLabel={true}
                        className={`${styles['contact-address--statecode']} `}
                        disabled={true}
                        options={allStates}
                        isDefaultOpen={
                          allStates.length > 1 &&
                          values.address.stateCode === ''
                            ? true
                            : false
                        }
                        initialValue={values.address.stateCode}
                        onChange={value => {
                          setFieldValue('address.stateCode', value);
                        }}
                        showValueAlways={true}
                      />
                    </StyledFormItem>
                  </Box>
                  {errors.address?.postalCode && (
                    <Typography variant='body2' color='error' mt={0.5}>
                      {errors.address?.postalCode}
                    </Typography>
                  )}
                  {!errors.address?.postalCode &&
                    values.address.postalCode.length > 0 &&
                    !loadingCountyAndState &&
                    allStates?.length === 0 && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        Invalid ZIP Code
                      </Typography>
                    )}
                  <StyledFormItem style={{ width: '100%', marginTop: '10px' }}>
                    <Select
                      placeholder='Select County'
                      className={`${styles['contact-address--statecode']} `}
                      options={allCounties}
                      initialValue={values.address.county}
                      isDefaultOpen={
                        allCounties.length > 1 && values.address.county === ''
                          ? true
                          : false
                      }
                      onChange={value => {
                        setFieldValue('address.county', value);
                        const { key: fip, state } = allCounties.filter(
                          item => item.value === value
                        )[0];
                        setFieldValue('address.countyFips', fip);
                        if (allCounties.length > 1) {
                          setFieldValue('address.stateCode', state);
                        }
                      }}
                      showValueAlways={true}
                    />
                  </StyledFormItem>
                </SectionContainer>

                <SectionContainer>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Medicare Beneficiary ID
                    </Typography>
                    <Textfield
                      id='mbi-number'
                      type='text'
                      placeholder='MBI Number'
                      name='medicareBeneficiaryID'
                      value={values.medicareBeneficiaryID}
                      onChange={handleChange}
                      onBlur={e => {
                        handleBlur(e);
                        setFieldValue(
                          'medicareBeneficiaryID',
                          formatMbiNumber(values.medicareBeneficiaryID)
                        );
                      }}
                    />
                    {errors?.medicareBeneficiaryID && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        {errors?.medicareBeneficiaryID}
                      </Typography>
                    )}
                  </StyledFormItem>
                </SectionContainer>

                <SectionContainer>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Medicare Part A Effective Date
                    </Typography>
                    <DatePickerMUI
                      value={values.partA === null ? '' : values.partA}
                      onChange={value => {
                        setFieldValue('partA', value);
                      }}
                      className={styles.disableDatePickerError}
                    />
                    {errors.partA && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        {errors.partA}
                      </Typography>
                    )}
                  </StyledFormItem>
                </SectionContainer>
                <SectionContainer>
                  <StyledFormItem>
                    <Typography
                      variant='h5'
                      color={'#052a63'}
                      marginBottom={0.5}
                    >
                      Medicare Part B Effective Date
                    </Typography>
                    <DatePickerMUI
                      value={values.partB === null ? '' : values.partB}
                      onChange={value => {
                        setFieldValue('partB', value);
                      }}
                      className={styles.disableDatePickerError}
                    />
                    {errors.partB && (
                      <Typography variant='body2' color='error' mt={0.5}>
                        {errors.partB}
                      </Typography>
                    )}
                  </StyledFormItem>
                </SectionContainer>
                <SectionContainer>
                  <Paper className={styles.specialAssistanceCard} elevation='0'>
                    <Stack
                      className={styles.specialAssistanceFormWrapper}
                      direction='row'
                    >
                      <Typography
                        variant='h5'
                        color={'#052a63'}
                        marginBottom={0.5}
                      >
                        Special Assistance
                      </Typography>
                      <Stack className={styles.specialAssistanceOptions}>
                        <Typography variant='body1' color='#434A51'>
                          Y
                        </Typography>
                        <Typography variant='body1' color='#434A51'>
                          N
                        </Typography>
                        <Typography variant='body1' color='#434A51'>
                          IDK
                        </Typography>
                      </Stack>
                      <Stack className={styles.specialAssistanceContainer}>
                        <Stack
                          direction='row'
                          className={styles.specialAssistanceRadios}
                        >
                          <Typography variant='body1' color='#434A51'>
                            Medicaid
                          </Typography>
                          <RadioGroup
                            row
                            name='hasMedicAid'
                            value={values.hasMedicAid}
                            onChange={evt => {
                              setFieldValue('hasMedicAid', evt.target.value);
                            }}
                          >
                            {[1, 0].map(option => (
                              <FormControlLabel
                                value={option}
                                control={<Radio />}
                              />
                            ))}
                          </RadioGroup>
                        </Stack>
                        <Divider />
                        <Stack
                          direction='row'
                          className={styles.specialAssistanceRadios}
                        >
                          <Typography variant='body1' color='#434A51'>
                            LIS
                          </Typography>
                          <RadioGroup
                            row
                            name='subsidyLevel'
                            value={values.subsidyLevel}
                            onChange={evt => {
                              setFieldValue('subsidyLevel', evt.target.value);
                            }}
                          >
                            {['Yes', 'No', "I Don't Know"].map(option => (
                              <FormControlLabel
                                value={option}
                                control={<Radio />}
                              />
                            ))}
                          </RadioGroup>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                </SectionContainer>

                {duplicateLeadIds?.length > 0 && (
                  <div className={`${styles['duplicate-lead']} mt-5 mb-4`}>
                    <div>
                      <Warning />
                    </div>
                    <div className={`${styles['duplicate-lead--text']} pl-1`}>
                      You can create this contact, but the entry is a potential
                      duplicate to{' '}
                      {duplicateLeadIds.length === 1 ? (
                        <a
                          href={getContactLink(duplicateLeadIds[0])}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {`this contact link`}
                        </a>
                      ) : (
                        <Link
                          to='/contacts'
                          target='_blank'
                          rel='noopener noreferrer'
                          onClick={handleMultileDuplicates}
                        >
                          {' '}
                          view duplicates
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </Form>
            </div>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <Label
                value={`Created Date: ${
                  getLocalDateTime(leadDetails?.createDate)?.fullDate
                }`}
                color='#717171'
                size='14px'
              />
            </Box>
            <Box className={styles.buttonContainer}>
              <Button
                label={'Cancel'}
                className={styles.deleteButton}
                type='tertiary'
                onClick={() => setIsEditMode(false)}
              />
              <Button
                label={'Save'}
                className={styles.editButton}
                disabled={
                  !dirty ||
                  !isValid ||
                  isInvalidZip ||
                  (!isEmailDeliverable &&
                    values.email &&
                    values.email !== '') ||
                  (values.email === '' && !dirty)
                }
                onClick={handleSubmit}
                type='tertiary'
                icon={<ArrowForwardWithCircle />}
                iconPosition='right'
              />
            </Box>
          </Box>
        );
      }}
    </Formik>
  );
}

export default ContactInfoForm;
