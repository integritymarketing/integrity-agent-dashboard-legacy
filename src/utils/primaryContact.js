import React from "react";
import PrimaryContactPhone from "pages/contacts/PrimaryContactPhone";

export const getPrimaryContact = (clientInfo) => {
  const { primaryCommunication, phones, emails, addresses } = clientInfo;
  if (primaryCommunication === "email") {
    const email = emails?.[0]?.leadEmail;
    return email ? <a href={`mailto:${email}`}>{email}</a> : "N/A";
  } else if (primaryCommunication === "phone") {
    const phone = phones?.[0]?.leadPhone;
    return phone ? (
      <PrimaryContactPhone
        countyFips={addresses?.[0]?.countyFips}
        postalCode={addresses?.[0]?.postalCode}
        leadsId={clientInfo.leadsId}
        phone={phone}
      />
    ) : "N/A";
  } else {
    return "N/A";
  }
};

export const getProviderPhone = (addresses) => {
  if (!addresses || addresses.length === 0) return "";

  const phoneNumbers = addresses[0]?.phoneNumbers;
  if (!phoneNumbers || phoneNumbers.length === 0) return "";

  return phoneNumbers[0] || "";
};
