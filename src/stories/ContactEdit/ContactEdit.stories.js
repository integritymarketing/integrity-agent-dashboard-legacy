import React from "react";
import { action } from "@storybook/addon-actions";
import ContactEdit from "components/ui/ContactEdit";
import { CountyProvider } from "contexts/counties";
import { DeleteLeadProvider } from "contexts/deleteLead";
import "pages/contacts/contactRecordInfo/contactRecordInfo.scss";
export default {
  title: "Design System/ContactEdit",
  component: ContactEdit,
};

const Template = (args) => (
  <div style={{ marginTop: 30, width: 1535, maxWidth: "100%", margin: "auto" }}>
    <DeleteLeadProvider>
      <CountyProvider>
        <ContactEdit {...args} />
      </CountyProvider>
    </DeleteLeadProvider>
  </div>
);

export const ContactEditInstance = Template.bind({});
ContactEditInstance.args = {
  id: 24390,
  initialSection: "details",
  personalInfo: {
    leadStatusId: 12,
    notes: null,
    leadsId: 24390,
    firstName: "Victoria",
    lastName: "Garcia",
    middleName: "R.",
    phones: [
      {
        createDate: "2021-08-09T17:48:31.5733333",
        leadPhone: "9095656565",
        modifyDate: null,
        phoneId: 1161,
        phoneLabel: "mobile",
      },
    ],
    emails: [
      {
        createDate: "2021-08-09T17:48:31.5733333",
        emailID: 7018,
        leadEmail: "asadfsdf@afjdsa.com",
        modifyDate: null,
      },
    ],
    addresses: [
      {
        address1: "",
        address2: "",
        city: "",
        stateCode: "",
        postalCode: "92701",
        countyFips: "01234",
      },
    ],
    contactPreferences: {
      contactPreferenceId: 667,
      dnd: false,
      email: false,
      mail: false,
      phone: true,
      primary: "phone",
      sms: false,
    },
  },
  isEdit: false,
};
