import React from "react";

import Checkbox from "components/ui/Checkbox";

export default {
  title: "Design System/Checkbox",
  component: Checkbox,
};

const Template = (args) => <Checkbox {...args} />;

export const Checked = Template.bind({});
Checked.args = {
  label: "Checkbox Label",
  checked: true,
};

export const UnChecked = Template.bind({});
UnChecked.args = {
  label: "Checkbox Label",
};
