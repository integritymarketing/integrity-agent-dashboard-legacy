import { useState } from 'react';

import { useLeadDetails } from 'providers/ContactDetails';

import { formatDate } from 'utils/dates';

import { EditHealthInfo } from './EditHealthInfo';
import { ViewHealthInfo } from './ViewHealthInfo';

const HealthInfoContainer = () => {
  const [isEditHealthInfo, setIsEditHealthInfo] = useState(false);
  const { leadDetails, updateLeadDetails } = useLeadDetails();

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

  const {
    birthdate,
    gender,
    weight,
    height,
    isTobaccoUser,
    modifyDate,
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

  const smoker = isTobaccoUser ? 'Yes' : 'No';

  // Helper function to extract the first value from an array or return a default value
  const getFirstValue = (array, defaultValue = null) =>
    array.length > 0 ? array[0] : defaultValue;

  // Helper function to extract properties from an object with default values
  const getAddressField = (address, field, defaultValue = '') =>
    address && address[field] ? address[field] : defaultValue;

  const onSave = async formData => {
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

    // Default communication type
    const isPrimary = contactPreferences?.primary || 'email';

    // Creating initial values with extracted data and formData
    const initialValues = {
      firstName,
      lastName,
      middleName,
      email,
      birthdate: birthdate ? formatDate(birthdate) : '',
      phones: {
        leadPhone: phone,
        phoneLabel: phoneLabel?.toLowerCase(),
      },
      address: {
        address1,
        address2,
        city,
        stateCode,
        postalCode,
        county: county || '',
        countyFips,
      },
      primaryCommunication: isPrimary,
      contactRecordType: contactRecordType?.toLowerCase(),
      emailID,
      leadAddressId: addressData?.leadAddressId || 0,
      phoneId: phoneData?.phoneId || 0,
      leadStatusId,
      leadsId,
      notes,
      medicareBeneficiaryID: medicareBeneficiaryID
        ? formatMbiNumber(medicareBeneficiaryID)
        : '',
      partA: partA ?? '',
      partB: partB ?? '',
      ...formData, // Merging formData into initialValues
    };

    // Preparing the payload and updating the lead
    const payload = {
      ...leadDetails,
      ...initialValues,
    };

    await updateLeadDetails(payload);
    setIsEditHealthInfo(false);
  };

  return (
    <>
      {isEditHealthInfo ? (
        <EditHealthInfo
          birthdate={birthdate}
          sexuality={gender}
          wt={weight ? weight : ''}
          hFeet={height ? Math.floor(height / 12) : ''}
          hInch={height ? height % 12 : ''}
          smoker={smoker}
          modifyDate={modifyDate}
          onSave={onSave}
          onCancel={() => setIsEditHealthInfo(false)}
          leadId={leadsId}
        />
      ) : (
        <ViewHealthInfo
          birthdate={birthdate}
          gender={gender}
          weight={weight ? weight : ''}
          height={height ? `${Math.floor(height / 12)}' ${height % 12}''` : ''}
          smoker={smoker}
          onEdit={() => setIsEditHealthInfo(true)}
        />
      )}
    </>
  );
};

export default HealthInfoContainer;
