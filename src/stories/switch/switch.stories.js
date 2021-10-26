import React from "react";

import Switch from "../../components/ui/switch";

export default {
  title: "Design System/Switch",
  component: Switch,
};

const CbTemplate = (args) => <Switch {...args} />;

export const Checked = CbTemplate.bind({});
Checked.args = {
  label: "Checked Checkbox Label",
  value: "",
};
