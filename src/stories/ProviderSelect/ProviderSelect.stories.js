import React from "react";
import ProviderSelect from "./../../components/ui/ProviderSelect";

export default {
  title: "Design System/Provider - Auto Save",
  component: ProviderSelect,
};

const Template = (args) => (
  <div style={{ marginTop: 30 }}>
    <ProviderSelect {...args} />
  </div>
);
export const DefaultProviderSelect = Template.bind({});
DefaultProviderSelect.args = {
  label: "Provider's Name",
};