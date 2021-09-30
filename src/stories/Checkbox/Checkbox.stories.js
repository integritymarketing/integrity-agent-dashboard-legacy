import React from "react";

import Checkbox from "../../components/ui/Checkbox";
import CheckboxGroup from "../../components/ui/CheckboxGroup";

export default {
  title: "Design System/Checkbox",
  component: Checkbox,
};

const CbTemplate = (args) => <Checkbox {...args} />;
const CGTemplate = (args) => <CheckboxGroup {...args} />;

export const Unchecked = CbTemplate.bind({});
Unchecked.args = {
  label: "Checkbox Label",
  value: "unchecked",
  id: "uncheckedOne",
};

export const Checked = CbTemplate.bind({});
Checked.args = {
  label: "Checked Checkbox Label",
  defaultChecked: true,
  value: "checked",
  id: "checkedOne",
};

export const Group = CGTemplate.bind({});
Group.args = {
  checkboxes: [
    {
      label: "Label One",
      defaultChecked: false,
      value: "one",
    },
    {
      label: "Label Two",
      defaultChecked: true,
      value: "two",
    },
    {
      label: "Label Three",
      defaultChecked: false,
      value: "four",
    },
    {
      label: "Label Five",
      defaultChecked: false,
      value: "five",
    },
  ],
};
