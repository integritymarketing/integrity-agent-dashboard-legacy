import React from "react";

import ArrowDownIcon  from '../../components/icons/arrow-down'

import { Button } from "../../components/ui/Button";

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
  icon: <ArrowDownIcon/>,
};

export const PrimaryWithIconRight = Template.bind({});
PrimaryWithIconRight.args = {
  label: "Button",
  icon: <ArrowDownIcon/>,
  iconPosition: 'right'
};

export const SecondaryWithIcon = Template.bind({});
SecondaryWithIcon.args = {
  label: "Button",
  type: 'secondary',
  icon: <ArrowDownIcon/>,
};

export const SecondaryWithIconRight = Template.bind({});
SecondaryWithIconRight.args = {
  label: "Button",
  type: 'secondary',
  icon: <ArrowDownIcon/>,
  iconPosition: 'right'
};

export const TertiaryWithIcon = Template.bind({});
TertiaryWithIcon.args = {
  label: "Button",
  type: "tertiary",
  icon: <ArrowDownIcon/>,
};

export const TertiaryWithIconRight = Template.bind({});
TertiaryWithIconRight.args = {
  label: "Button",
  type: "tertiary",
  icon: <ArrowDownIcon/>,
  iconPosition: 'right'
};

export const IconOnly = Template.bind({});
IconOnly.args = {
  label: "Button",
  icon: <ArrowDownIcon/>,
  iconOnly: true
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
  href: "https://example.com"
};

export const RenderAsRouterLink = Template.bind({});
// Should be able to render as <a> element
// <Link to="/" className="...">Button</Link>
RenderAsRouterLink.args = {
  label: "Router Link as Button",
  linkTo: '/clients'
};
// Add more Button stories here
