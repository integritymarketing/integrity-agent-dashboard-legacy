import useQueryParams from '../../hooks/useQueryParams';
import useFilteredLeadIds from '../../pages/ContactsList/hooks/useFilteredLeadIds';
import React, { useContext, useMemo, useRef, useState } from 'react';
import useAnalytics from 'hooks/useAnalytics';
import { Link, useNavigate } from 'react-router-dom';
import useToast from 'hooks/useToast';
import { Formik, useFormik } from 'formik';
import { formatMbiNumber, scrollTop } from 'utils/shared-utils/sharedUtility';
import analyticsService from 'services/analyticsService';
import styles from './ContactForm.module.scss';
import Warning from 'components/icons/warning';
import BasicDetails from 'components/ContactForm/BasicDetails/BasicDetails';
import AddressDetails from 'components/ContactForm/AddressDetails/AddressDetails';
import CommunicationDetails from 'components/ContactForm/CommunicationDetails/CommunicationDetails';
import MedicareIDDetails from 'components/ContactForm/MedicareIDDetails/MedicareIDDetails';
import MedicaidLISDetails from 'components/ContactForm/MedicaidLISDetails/MedicaidLISDetails';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import CountyContext from 'contexts/counties';
import useAddNewContact from 'hooks/ContactForm/useAddNewContact';
import useDuplicateContact from 'hooks/ContactForm/useDuplicateContact';
import useLinkContact from 'hooks/ContactForm/useLinkContact';
import { useClientServiceContext } from 'services/clientServiceProvider';

import { Box } from '@mui/system';
import * as Yup from 'yup';
import {
  getBirthDateSchema,
  getTextFieldSchema,
  getAddressSchema,
  getMedicareBeneficiaryIDSchema,
} from 'ValidationSchemas';

const ContactForm = ({
  callLogId,
  firstName,
  lastName,
  hasMedicAid,
  state,
  partA = '',
  partB = '',
  medicareBeneficiaryID = '',
  tags = [],
}) => {
  const { get } = useQueryParams();
  const { setFilteredDataHandle } = useFilteredLeadIds();
  const { checkDuplicateContact } = useDuplicateContact();
  const { addNewContact } = useAddNewContact();
  const { linkContact } = useLinkContact();
  const { callRecordingsService } = useClientServiceContext();
  const addNewDuplicateErrorRef = useRef();
  const { fireEvent } = useAnalytics();
  const callFrom = decodeURIComponent(
    get('callFrom')?.replace(/\s/g, '+') || ''
  ).replace(/^\+?1/, '');
  const isRelink = get('relink') === 'true';
  const inbound = get('inbound') === 'true';
  const name = get('name');
  const [duplicateLeadIds, setDuplicateLeadIds] = useState([]);
  const [isEmailDeliverable, setIsEmailDeliverable] = useState(false);

  const initialFormValues = {
    prefix: null,
    firstName,
    lastName,
    suffix: null,
    middleName: '',
    maritalStatus: 'Unknown',
    hasMedicAid,
    subsidyLevel: null,
    email: '',
    birthdate: '',
    phones: {
      leadPhone: callFrom,
      phoneLabel: 'mobile',
    },
    address: {
      address1: '',
      address2: '',
      city: '',
      stateCode: '',
      postalCode: '',
      county: '',
      countyFips: '',
    },
    medicareBeneficiaryID: medicareBeneficiaryID
      ? formatMbiNumber(medicareBeneficiaryID)
      : '',
    partA: partA ?? '',
    partB: partB ?? '',
    primaryCommunication: '',
  };

  const validationSchema = Yup.object().shape({
    ...getTextFieldSchema('firstName', 'First Name').fields,
    ...getTextFieldSchema('lastName', 'Last Name').fields,
    ...getBirthDateSchema().fields,
    ...getAddressSchema().fields,
    ...getMedicareBeneficiaryIDSchema().fields,
  });

  const navigate = useNavigate();
  const showToast = useToast();
  const {
    allStates = [],
    allCounties = [],
    loading: loadingCountyAndState,
  } = useContext(CountyContext);

  const getContactLink = id => `/contact/${id}/overview`;
  const goToContactDetailPage = id => navigate(getContactLink(id));
  const goToContactPage = () => navigate('/contacts/list');

  const handleMultipleDuplicates = () => {
    if (duplicateLeadIds.length) {
      setFilteredDataHandle(
        'duplicateLeadIds',
        'addNewContact',
        duplicateLeadIds,
        null
      );
    }
    return true;
  };

  const handleLinkContact = async leadIdParam => {
    try {
      await linkContact(leadIdParam, state);
      showToast({ message: 'Contact linked successfully', time: 4000 });
      fireEvent('Call Linked', { leadid: leadIdParam.toString() });
      setTimeout(() => goToContactDetailPage(leadIdParam), 4000);
    } catch (error) {
      showToast({ type: 'error', message: error.message, time: 4000 });
    }
  };

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      const duplicateCheckResponse = await checkDuplicateContact(values);
      let duplicateCheckResult;
      if (duplicateCheckResponse?.isExactDuplicate) {
        duplicateCheckResult = {
          firstName: 'Duplicate Contact',
          lastName: 'Duplicate Contact',
          isExactDuplicate: true,
        };
      } else {
        duplicateCheckResult = {
          duplicateLeadIds: duplicateCheckResponse?.duplicateLeadIds || [],
          isExactDuplicate: false,
        };
        setDuplicateLeadIds(duplicateCheckResult.duplicateLeadIds);
      }

      if (duplicateCheckResult?.isExactDuplicate) {
        analyticsService.fireEvent('event-form-submit-invalid', {
          formName: 'Duplicate Contact Error',
        });
        setErrors({
          firstName: 'Duplicate Contact',
          lastName: 'Duplicate Contact',
        });
        scrollTop();
        setSubmitting(false);
        return;
      }

      try {
        const payload = {
          ...values,
          email: isEmailDeliverable ? values.email : '',
        };
        const newContactResponse = await addNewContact(payload);
        const leadId = newContactResponse.leadsId;

        fireEvent('event-form-submit', { formName: 'New Contact' });

        if (callLogId && callLogId !== 'undefined') {
          const tagsArray = tags?.split(',').map(Number);
          if (name === 'Text') {
            await callRecordingsService.assignsLeadToOutboundSmsRecord({
              smsLogId: callLogId,
              leadId,
              tagIds: tagsArray,
            });
          } else {
            await callRecordingsService.assignsLeadToInboundCallRecord({
              callLogId,
              leadId,
              isInbound: inbound,
              tagIds: tagsArray,
            });
          }
        }

        fireEvent('Call Linked', { leadid: leadId });
        showToast({ message: 'Contact added successfully' });

        if (isRelink) {
          await handleLinkContact(leadId);
        }

        setTimeout(() => goToContactDetailPage(leadId), 4000);
      } catch (err) {
        console.error('Error while adding contact:', err);
        showToast({ message: err.message, type: 'error' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const showDuplicateContactSection = () => {
    return (
      <>
        {duplicateLeadIds?.length > 0 && (
          <div className={styles.duplicateMessageContainer}>
            <Warning />
            <div className={styles.duplicateMessage}>
              You can create this contact, but the entry is a potential
              duplicate to{' '}
              {duplicateLeadIds.length === 1 ? (
                <a
                  href={getContactLink(duplicateLeadIds[0])}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  this contact link
                </a>
              ) : (
                <Link
                  to='/contacts'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={handleMultipleDuplicates}
                >
                  view duplicates
                </Link>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const { values, errors, isValid, dirty, handleSubmit, isSubmitting } = formik;

  const isInvalidZip =
    (values.address.postalCode.length === 5 &&
      !loadingCountyAndState &&
      allStates?.length === 0) ||
    (values.address.postalCode > 0 && values.address.postalCode.length < 5);

  const isNotStateOrCounty =
    allStates?.length > 0 &&
    allCounties?.length > 0 &&
    !loadingCountyAndState &&
    (values.address.stateCode.length === 0 ||
      values.address.county.length === 0);

  const isValidPrimaryCommunication = useMemo(() => {
    const isPrimaryCommunicationValid =
      values.primaryCommunication === 'phone' ||
      values.primaryCommunication === 'email';
    return isPrimaryCommunicationValid;
  }, [values.primaryCommunication]);

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
      const digitsOnly = values.phones?.leadPhone?.replace(/\D/g, '');
      return digitsOnly.length === 10;
    }
    return false;
  }, [values, isEmailDeliverable]);

  const isPhoneValid = useMemo(() => {
    if (values?.phones?.leadPhone) {
      const digitsOnly = values.phones?.leadPhone?.replace(/\D/g, '');
      return digitsOnly.length === 10;
    }
    return true;
  }, [values]);

  const isEmailValid = useMemo(() => {
    if (values?.email) {
      const emailPattern = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;
      return emailPattern.test(values.email);
    }
    return true;
  }, [values]);

  const formValid = useMemo(() => {
    return (
      isValid &&
      !isInvalidZip &&
      !isSubmitting &&
      !isNotStateOrCounty &&
      isPhoneorEmailValid &&
      dirty &&
      isValidPrimaryCommunication &&
      isPhoneValid &&
      isEmailValid
    );
  }, [
    isValid,
    isInvalidZip,
    isSubmitting,
    isNotStateOrCounty,
    isPhoneorEmailValid,
    dirty,
    isValidPrimaryCommunication,
    isPhoneValid,
    isEmailValid,
  ]);

  return (
    <Box className={styles.formSection}>
      <Formik {...formik}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <Box className={styles.subContainer}>
            <BasicDetails formik={formik} fieldSet={addNewDuplicateErrorRef} />
          </Box>
          <Box className={styles.subContainer}>
            <AddressDetails formik={formik} />
          </Box>
          <Box className={styles.subContainer}>
            <CommunicationDetails
              formik={formik}
              setIsEmailDeliverable={setIsEmailDeliverable}
            />
          </Box>
          <Box className={styles.subContainer}>
            <MedicareIDDetails formik={formik} />
          </Box>
          <Box className={styles.subContainer}>
            <MedicaidLISDetails formik={formik} />
          </Box>
          <div className={styles.requiredFieldLabel}>*Required fields</div>
          {showDuplicateContactSection()}
          <div>
            <div className={styles.footer}>
              <Button
                data-gtm='new-contact-cancel-button'
                type='button'
                onClick={goToContactPage}
              >
                Cancel
              </Button>
              <Button
                data-gtm='new-contact-create-button'
                type='submit'
                variant='contained'
                color='primary'
                disabled={!formValid}
              >
                Create Contact
              </Button>
            </div>
          </div>
        </form>
      </Formik>
    </Box>
  );
};

ContactForm.propTypes = {
  callLogId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prefix: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  suffix: PropTypes.string,
  maritalStatus: PropTypes.string,
  hasMedicAid: PropTypes.oneOfType([null, PropTypes.number]),
  lis: PropTypes.oneOfType([null, PropTypes.number]),
  state: PropTypes.object.isRequired,
  partA: PropTypes.string,
  partB: PropTypes.string,
  medicareBeneficiaryID: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default ContactForm;