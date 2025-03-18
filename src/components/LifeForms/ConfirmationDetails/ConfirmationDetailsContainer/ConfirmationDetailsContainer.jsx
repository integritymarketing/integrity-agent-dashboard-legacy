import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLeadDetails } from 'providers/ContactDetails';

import { formatDate } from 'utils/dates';
import { formatMbiNumber } from 'utils/shared-utils/sharedUtility';

import PlanCardLoader from 'components/ui/PlanCard/loader';

import { ConfirmationDetailsForm } from '../ConfirmationDetailForm';
import { ContactProfileTabBar } from 'components/ContactDetailsContainer';
import { LIFE_FORM_TYPES } from 'components/LifeForms/LifeForm.constants';
import PropTypes from 'prop-types';

export const ConfirmationDetailsContainer = ({ contactId, quoteType }) => {
  const contactFormDataRef = useRef(null);

  const navigate = useNavigate();

  const { leadDetails, updateLeadDetails, isLoadingLeadDetails } =
    useLeadDetails();

  const onSave = async formData => {
    const {
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

    const code = JSON.stringify({ stateCode: formData.stateCode });
    sessionStorage.setItem(contactId, code);

    const email = emails.length > 0 ? emails[0].leadEmail : null;
    const phoneData = phones.length > 0 ? phones[0] : null;
    const addressData = addresses.length > 0 ? addresses?.[0] : null;
    const emailID = emails.length > 0 ? emails[0].emailID : 0;
    const leadAddressId =
      addressData && addressData.leadAddressId ? addressData.leadAddressId : 0;
    const phoneId = phoneData && phoneData.phoneId ? phoneData.phoneId : 0;

    const city = addressData && addressData.city ? addressData.city : '';
    const stateCode =
      addressData && addressData.stateCode
        ? addressData.stateCode
        : formData.stateCode;
    const address1 =
      addressData && addressData.address1 ? addressData.address1 : '';
    const address2 =
      addressData && addressData.address2 ? addressData.address2 : '';
    const county = addressData && addressData.county ? addressData.county : '';
    const countyFips =
      addressData && addressData.countyFips ? addressData.countyFips : '';
    const postalCode =
      addressData && addressData.postalCode ? addressData.postalCode : '';
    const phone = phoneData && phoneData.leadPhone ? phoneData.leadPhone : '';
    const phoneLabel =
      phoneData && phoneData.phoneLabel ? phoneData.phoneLabel : 'mobile';

    const isPrimary = contactPreferences?.primary
      ? contactPreferences?.primary
      : 'email';

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

    const response = await updateLeadDetails(payload);

    contactFormDataRef.current = { ...formData };

    if (response) {
      switch (quoteType) {
        case LIFE_FORM_TYPES.IUL_ACCUMULATION:
          navigate(`/life/iul-accumulation/${contactId}/product-preferences`);
          break;

        case LIFE_FORM_TYPES.IUL_PROTECTION:
          navigate(`/life/iul-protection/${contactId}/product-preferences`);
          break;

        case LIFE_FORM_TYPES.TERM:
          navigate(`/life/term/${contactId}/carriers`);
          break;
      }
    }
  };

  const renderContactDetailsLoader = useMemo(() => <PlanCardLoader />, []);

  return (
    <>
      <ContactProfileTabBar
        contactId={contactId}
        showTabs={false}
        backButtonRoute={`/contact/${contactId}`}
      />
      {isLoadingLeadDetails ? (
        renderContactDetailsLoader
      ) : (
        <>
          <ConfirmationDetailsForm
            contactId={contactId}
            onSave={onSave}
            quoteType={quoteType}
          />
        </>
      )}
    </>
  );
};

ConfirmationDetailsContainer.propTypes = {
  contactId: PropTypes.string.isRequired,
  quoteType: PropTypes.oneOf([
    LIFE_FORM_TYPES.IUL_ACCUMULATION,
    LIFE_FORM_TYPES.IUL_PROTECTION,
    LIFE_FORM_TYPES.TERM,
  ]).isRequired,
};
