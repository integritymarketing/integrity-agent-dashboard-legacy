import React from "react";

import { Button } from "./Button";

export default {
  title: "Design System/Button",
  component: Button,
  argTypes: { onClick: { action: "clicked" } },
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: "secondary",
  label: "Button",
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  type: "tertiary",
  label: "Button",
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Button",
  disabled: true,
};

export const PrimaryWithIcon = Template.bind({});
PrimaryWithIcon.args = {
  label: "Button",
};

export const PrimaryWithIconRight = Template.bind({});
PrimaryWithIconRight.args = {
  label: "Button",
};

export const SecondaryWithIcon = Template.bind({});
SecondaryWithIcon.args = {
  label: "Button",
};

export const SecondaryWithIconRight = Template.bind({});
SecondaryWithIconRight.args = {
  label: "Button",
};

export const TertiaryWithIcon = Template.bind({});
TertiaryWithIcon.args = {
  label: "Button",
};

export const TertiaryWithIconRight = Template.bind({});
TertiaryWithIconRight.args = {
  label: "Button",
};

export const IconOnly = Template.bind({});
IconOnly.args = {
  label: "Button",
};

export const PrimaryOnDarkBg = Template.bind({});
PrimaryOnDarkBg.args = {
  label: "Button",
};

export const SecondaryOnDarkBg = Template.bind({});
SecondaryOnDarkBg.args = {
  label: "Button",
};

export const TertiaryOnDarkBg = Template.bind({});
TertiaryOnDarkBg.args = {
  label: "Button",
};

export const RenderAsHref = Template.bind({});
// Should be able to render as <a> element
// <a href="https://..." className="...">Button</a>
RenderAsHref.args = {
  label: "Link as Button",
};

export const RenderAsRouterLink = Template.bind({});
// Should be able to render as <a> element
// <Link to="/" className="...">Button</Link>
RenderAsRouterLink.args = {
  label: "Router Link as Button",
};
// Add more Button stories here
