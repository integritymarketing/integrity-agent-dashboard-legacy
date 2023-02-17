import React from "react";
import Spinner from "./../../components/ui/Spinner";

export default {
  title: "Design System/Spinner",
  component: Spinner,
};

const Template = (args) => (
  <div style={{ marginTop: 30 }}>
    <Spinner {...args} />
  </div>
);
export const WithSpinnerLoaded = Template.bind({});
