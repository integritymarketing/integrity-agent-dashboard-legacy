import React from "react";

import Popover from "../../components/ui/Popover";
import Info from "../../components/icons/info-blue";
import { Button } from "../../components/ui/Button";

export default {
  title: "Design System/Popover",
  component: Popover,
};

const Template = (args) => (
  <div
    style={{
      marginTop: 200,
      height: 400,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Popover {...args}>
      <span style={{ padding: 10, border: "1px solid" }}>On Hover popover</span>
    </Popover>
  </div>
);

export const TextOnlyRightCenter = Template.bind({});
TextOnlyRightCenter.args = {
  openOn: "hover",
  title: "Client Snapshot",
  description:
    "Client Snapshot shows the number of contacts that are in each stage for Medicare CENTER only.",
  positions: ["right", "bottom"],
  align: "center",
};

export const TextIconLeftEnd = Template.bind({});
TextIconLeftEnd.args = {
  openOn: "hover",
  icon: <Info />,
  title: "Client Snapshot",
  description:
    "Client Snapshot shows the number of contacts that are in each stage for Medicare CENTER only.",
  positions: ["left", "bottom"],
  align: "end",
};

export const TextOnlyTopEnd = Template.bind({});
TextOnlyTopEnd.args = {
  openOn: "hover",
  title: "Client Snapshot",
  description:
    "Client Snapshot shows the number of contacts that are in each stage for Medicare CENTER only.",
  positions: ["top", "bottom"],
  align: "end",
};

export const TextIconBottomStart = Template.bind({});
TextIconBottomStart.args = {
  openOn: "hover",
  icon: <Info />,
  title: "Client Snapshot",
  description:
    "Client Snapshot shows the number of contacts that are in each stage for Medicare CENTER only.",
  positions: ["bottom"],
  align: "start",
};

export const TextIconWithFooter = Template.bind({});
TextIconWithFooter.args = {
  openOn: "hover",
  icon: <Info />,
  title: "Client Snapshot",
  description:
    "Client Snapshot shows the number of contacts that are in each stage for Medicare CENTER only.",
  positions: ["bottom"],
  align: "start",
  footer: (
    <>
      <Button type="secondary" label="CTA Primary"></Button>{" "}
      <Button label="CTA Primary w"></Button>
    </>
  ),
};

export const TextIconWithSingleButtonFooter = Template.bind({});
TextIconWithSingleButtonFooter.args = {
  openOn: "hover",
  icon: <Info />,
  title: "Client Snapshot",
  description:
    "Client Snapshot shows the number of contacts that are in each stage for Medicare CENTER only.",
  positions: ["bottom"],
  align: "start",
  footer: (
    <>
      <Button type="secondary" label="CTA Primary"></Button>
    </>
  ),
};
