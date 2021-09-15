import React from "react";
import { action } from "@storybook/addon-actions";

import ContactRecordHeader from "components/ui/ContactRecordHeader";

export default {
  title: "Design System/ContactRecordHeader",
  component: ContactRecordHeader,
};

const Template = (args) => (
  <div style={{ marginTop: 30, width: 1535, maxWidth: "100%", margin: "auto" }}>
    <ContactRecordHeader {...args} />
  </div>
);

export const ContactRecordHeaderWithContact = Template.bind({});
ContactRecordHeaderWithContact.args = {
  contact: {
    firstName: "Victoria",
    lastName: "Garcia",
    middleName: "R.",
    addresses: [
      {
        address1: "",
        address2: "",
        city: "",
        stateCode: "",
        postalCode: "92701",
      },
    ],
  },
  providersCount: 5,
  prescriptionsCount: 3,
  pharmacyCount: 1,
  isMobile: false,
};
