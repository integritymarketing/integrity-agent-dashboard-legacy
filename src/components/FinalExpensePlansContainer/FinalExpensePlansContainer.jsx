import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useLeadDetails } from 'providers/ContactDetails';

import { formatDate } from 'utils/dates';
import { formatMbiNumber } from 'utils/shared-utils/sharedUtility';

import useAnalytics from 'hooks/useAnalytics';

import PlanCardLoader from 'components/ui/PlanCard/loader';
import WithLoader from 'components/ui/WithLoader';

import FinalExpenseContactDetailsForm from './FinalExpenseContactDetailsForm';
import { ContactProfileTabBar } from 'components/ContactDetailsContainer';
import { useCreateNewQuote } from '../../providers/CreateNewQuote';
import styles from './index.module.scss';
import { SIMPLIFIED_IUL_TITLE } from './FinalExpensePlansContainer.constants';
import Typography from '@mui/material/Typography';

export const FinalExpensePlansContainer = () => {
  const { contactId } = useParams();
  const contactFormDataRef = useRef(null);

  const navigate = useNavigate();
  const { fireEvent } = useAnalytics();

  const { leadDetails, updateLeadDetails, isLoadingLeadDetails } =
    useLeadDetails();
  const { isSimplifiedIUL } = useCreateNewQuote();

  useEffect(() => {
    fireEvent('Final Expense Intake Viewed', {
      leadid: contactId,
    });
  }, [contactId]);

  // Helper function to extract the first value from an array or return a default value
  const getFirstValue = (array, defaultValue = null) =>
    array.length > 0 ? array[0] : defaultValue;

  // Helper function to extract properties from an object with default values
  const getAddressField = (address, field, defaultValue = '') =>
    address && address[field] ? address[field] : defaultValue;

  const onSave = useCallback(
    async formData => {
      const code = JSON.stringify({ stateCode: formData.stateCode });
      sessionStorage.setItem(contactId, code);

      const {
        modifyDate = '',
        addresses,
        contactPreferences,
        emails,
        phones,
        firstName,
        lastName,
        middleName,
        leadsId,
        contactRecordType,
        leadStatusId,
        notes,
        medicareBeneficiaryID,
        partA,
        partB,
      } = leadDetails;

      // Extracting values with helper functions
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

      const phone = phoneData ? phoneData.leadPhone : '';
      const phoneLabel = phoneData ? phoneData.phoneLabel : 'mobile';
      const leadAddressId = getAddressField(addressData, 'leadAddressId');
      const phoneId = getAddressField(phoneData, 'phoneId');
      // Default communication type
      const isPrimary = contactPreferences?.primary || 'email';

      const initialValues = {
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        email: email,
        birthdate: leadDetails?.birthdate
          ? formatDate(leadDetails?.birthdate)
          : '',
        address: {
          address1: address1,
          address2: address2,
          city: city,
          stateCode: stateCode,
          postalCode: postalCode,
          county: county || '',
          countyFips: countyFips,
        },
        primaryCommunication: isPrimary,
        contactRecordType: contactRecordType?.toLowerCase(),
        emailID,
        leadAddressId,
        phoneId,
        leadStatusId,
        leadsId,
        modifyDate,
        notes,
        medicareBeneficiaryID: medicareBeneficiaryID
          ? formatMbiNumber(medicareBeneficiaryID)
          : '',
        partA: partA ?? '',
        partB: partB ?? '',
        ...formData,
      };

      if (phone) {
        initialValues.phones = {
          leadPhone: phone,
          phoneLabel: phoneLabel?.toLowerCase(),
        };
      }

      const payload = {
        ...leadDetails,
        ...initialValues,
      };

      await updateLeadDetails(payload);

      contactFormDataRef.current = { ...formData };
      fireEvent('Final Expense Intake Completed', {
        leadid: contactId,
      });

      // Ensure isSimplifiedIUL() is reevaluated correctly
      if (await isSimplifiedIUL()) {
        navigate(`/simplified-iul/healthconditions/${contactId}`);
      } else {
        navigate(`/finalexpenses/healthconditions/${contactId}`);
      }
    },
    [
      isSimplifiedIUL,
      leadDetails,
      updateLeadDetails,
      contactId,
      navigate,
      fireEvent,
    ]
  );

  const renderContactDetailsLoader = useMemo(() => <PlanCardLoader />, []);
  return (
    <WithLoader isLoading={isLoadingLeadDetails}>
      <ContactProfileTabBar
        contactId={contactId}
        showTabs={false}
        backButtonLabel={'Back to Contact'}
        backButtonRoute={`/contact/${contactId}/overview`}
      />
      <div className={styles.pageHeading}>
        <Typography variant='h2' color='#052A63'>
          {' '}
          {isSimplifiedIUL() ? SIMPLIFIED_IUL_TITLE : 'Final Expense'}
        </Typography>
      </div>
      {isLoadingLeadDetails ? (
        renderContactDetailsLoader
      ) : (
        <FinalExpenseContactDetailsForm contactId={contactId} onSave={onSave} />
      )}
    </WithLoader>
  );
};
