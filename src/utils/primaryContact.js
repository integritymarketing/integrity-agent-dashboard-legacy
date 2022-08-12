import React from "react";
import PrimaryContactPhone from 'pages/contacts/PrimaryContactPhone';

export const getPrimaryContact = (clientInfo) => {
  const { primaryCommunication, phones, emails } = clientInfo;
  if (primaryCommunication === "email") {
    const email = emails.map((email) => email.leadEmail);
    return email;
  } else if (primaryCommunication === "phone") {
    const phone = phones.map((phone) => phone.leadPhone);
    return <PrimaryContactPhone leadsId={clientInfo.leadsId} phone={phone[0]} />;
  } else return "N/A";
};
