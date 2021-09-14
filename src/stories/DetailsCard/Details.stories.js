import React from "react";
import { action } from "@storybook/addon-actions";

import DetailsCard from "components/ui/DetailsCard";

export default {
  title: "Design System/DetailsCard",
  component: DetailsCard,
};

const Template = (args) => (
  <div style={{ marginTop: 30, width: 835, maxWidth:'100%' }}>
    <DetailsCard {...args} />
  </div>
);

export const DetailsCardWithNoContents = Template.bind({});
DetailsCardWithNoContents.args = {
  headerTitle: "Providers",
  onAddClick:  action("Add button Clicked"),
};
