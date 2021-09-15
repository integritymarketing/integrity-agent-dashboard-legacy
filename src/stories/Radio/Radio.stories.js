import React from "react";

import Radio from "../../components/ui/Radio";

export default {
  title: "Design System/Radio",
  component: Radio,
};

const Template = (args) => <Radio {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "Radio Label",
};
