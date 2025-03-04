import { useRef, useState, useCallback, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import PropTypes from 'prop-types';

import SMSPhoneNumberInput from 'components/ui/SMSPhoneNumberInput';
import EmailInput from 'components/ui/EmailInput';
import AlertMessage from 'components/Alert';

const CommunicationInputsGroup = ({
  formik,
  page,
  defaultEmail,
  defaultPhone,
  setIsEmailDeliverable,
}) => {
  const { values, handleBlur, setFieldValue } = formik;

  const emailFieldRef = useRef(null);
  const phoneFieldRef = useRef(null);

  const [validationMessages, setValidationMessages] = useState({
    email: { status: null, message: '', title: '' },
    phone: { status: null, message: '', title: '' },
  });

  const validateEmailInput = useCallback(
    ({ email, status, message, title }) => {
      setFieldValue('email', email);
      if (status === 'success') {
        setIsEmailDeliverable(true);
      } else {
        setIsEmailDeliverable(false);
      }
      if (!values.primaryCommunication) {
        setFieldValue('primaryCommunication', 'email');
      }
      if (page === 'quickQuote') {
        setFieldValue('primaryCommunication', 'email');
      }
      setValidationMessages(prev => ({
        ...prev,
        email: { status, message, title },
        phone: prev.phone,
      }));
    },
    [setFieldValue, values.primaryCommunication]
  );

  const validatePhoneInput = useCallback(
    ({ phone, status, message, title }) => {
      setFieldValue('phones.leadPhone', phone);
      if (!values.primaryCommunication) {
        setFieldValue('primaryCommunication', 'phone');
      }
      if (page === 'quickQuote') {
        setFieldValue('primaryCommunication', 'phone');
      }
      setValidationMessages(prev => ({
        ...prev,
        phone: { status, message, title },
        email: prev.email,
      }));
    },
    [setFieldValue, values.primaryCommunication]
  );

  useEffect(() => {
    if (page !== 'quickQuote') {
      if (values?.primaryCommunication === 'email') {
        if (values?.email === '') {
          setValidationMessages(() => {
            if (values?.phones?.leadPhone === '') {
              return {
                phone: { status: null, message: '', title: '' },
                email: {
                  title: 'Email',
                  status: 'warning',
                  message: 'Email is required',
                },
              };
            } else {
              return {
                ...validationMessages,
                email: {
                  title: 'Email',
                  status: 'warning',
                  message: 'Email is required',
                },
              };
            }
          });
        }
        if (values?.phones?.leadPhone === '' && values?.email) {
          setValidationMessages({
            ...validationMessages,
            phone: { status: null, message: '', title: '' },
          });
        }
      } else if (values?.primaryCommunication === 'phone') {
        if (values?.phones?.leadPhone === '') {
          setValidationMessages(() => {
            if (values?.email === '') {
              return {
                email: { status: null, message: '', title: '' },
                phone: {
                  title: 'Phone',
                  status: 'warning',
                  message: 'Phone is required',
                },
              };
            } else {
              return {
                ...validationMessages,
                phone: {
                  title: 'Phone',
                  status: 'warning',
                  message: 'Phone is required',
                },
              };
            }
          });
        }
        if (values?.email === '' && values?.phones?.leadPhone) {
          setValidationMessages({
            ...validationMessages,
            email: { status: null, message: '', title: '' },
          });
        }
      }
    }
  }, [
    values.primaryCommunication,
    values.email,
    values.phones.leadPhone,
    values,
    page,
  ]);

  return (
    <>
      {/* Email Input */}
      <Grid
        item
        xs={12}
        md={page === 'addNew' || page === 'quickQuote' ? 6 : 12}
      >
        <Box>
          <EmailInput
            onValidation={validateEmailInput}
            label={`Email Address${page === 'quickQuote' ? ' *' : ''}`}
            size={page === 'addNew' ? 'medium' : 'small'}
            inputRef={emailFieldRef}
            onBlur={handleBlur}
            defaultValue={defaultEmail}
          />
          {validationMessages.email.status && (
            <Box>
              <AlertMessage
                status={validationMessages.email.status}
                title={validationMessages.email.title}
                message={validationMessages.email.message}
              />
            </Box>
          )}
        </Box>
      </Grid>

      {/* Phone Input */}
      <Grid
        item
        xs={12}
        md={page === 'addNew' || page === 'quickQuote' ? 6 : 12}
      >
        <Box>
          <SMSPhoneNumberInput
            onValidation={validatePhoneInput}
            label={`Phone Number${page === 'quickQuote' ? ' *' : ''}`}
            size={page === 'addNew' ? 'medium' : 'small'}
            inputRef={phoneFieldRef}
            defaultValue={defaultPhone}
          />
          {validationMessages.phone.status && (
            <Box>
              <AlertMessage
                status={validationMessages.phone.status}
                title={validationMessages.phone.title}
                message={validationMessages.phone.message}
              />
            </Box>
          )}
        </Box>
      </Grid>
    </>
  );
};

CommunicationInputsGroup.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      primaryCommunication: PropTypes.oneOf(['email', 'phone']).isRequired,
      email: PropTypes.string,
      phones: PropTypes.shape({
        leadPhone: PropTypes.string,
      }).isRequired,
    }).isRequired,
    handleBlur: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};

export default CommunicationInputsGroup;
