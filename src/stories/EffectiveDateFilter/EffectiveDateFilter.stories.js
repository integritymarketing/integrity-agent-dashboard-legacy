import React from "react";
import { action } from "@storybook/addon-actions";

import EffectiveDateFilter from "components/ui/EffectiveDateFilter";
import { getNextEffectiveDate } from "utils/dates";

export default {
  title: "Design System/EffectiveDateFilter",
  component: EffectiveDateFilter,
};

const Template = (args) => (
  <div style={{ marginTop: 30, width: 262, maxWidth: "100%", margin: "auto" }}>
    <EffectiveDateFilter {...args} />
  </div>
);

var nextEffectiveDate = getNextEffectiveDate([2021, 2022]);
export const EffectiveDateFilterCustom = Template.bind({});
EffectiveDateFilterCustom.args = {
  years: [2021, 2022],
  onChange: (value) => {
    nextEffectiveDate = value;
    action("on change")(nextEffectiveDate);
  },
  initialValue: nextEffectiveDate,
};
