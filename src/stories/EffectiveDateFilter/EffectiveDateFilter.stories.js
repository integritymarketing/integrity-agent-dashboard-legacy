import React from "react";
import { action } from "@storybook/addon-actions";

import EffectiveDateFilter from "components/ui/EffectiveDateFilter";

export default {
  title: "Design System/EffectiveDateFilter",
  component: EffectiveDateFilter,
};

const Template = (args) => (
  <div style={{ marginTop: 30, width: 262, maxWidth: "100%", margin: "auto" }}>
    <EffectiveDateFilter {...args} />
  </div>
);

export const EffectiveDateFilterCustom = Template.bind({});
EffectiveDateFilterCustom.args = {
  onChange: action("on change"),
};
