import React from "react";

import { Select, DefaultOption } from "../../components/ui/Select";

export default {
  title: "Design System/Select",
  component: Select,
  argTypes: { onClick: { action: "clicked" } },
};

const Template = (args) => <Select {...args} />;

export const WithoutIntialValue = Template.bind({});
WithoutIntialValue.args = {
  placeholder: "- Sort by -",
  Option: DefaultOption,
  options: [
    {
      label: "Reminder Asc",
      value: "reminder-asc",
    },
    {
      label: "Reminder Desc",
      value: "reminder-desc",
    },
    {
      label: "Newest First",
      value: "newest",
    },
    {
      label: "Olderst Firstc",
      value: "oldest",
    },
    {
      label: "Last Name Asc",
      value: "lastname-asc",
    },
    {
      label: "Last Name Desc",
      value: "lastname-desc",
    },
  ],
};

export const WithIntialValue = Template.bind({});
WithIntialValue.args = {
  initialValue: "newest",
  placeholder: "- Sort by -",
  Option: DefaultOption,
  options: [
    {
      label: "Reminder Asc",
      value: "reminder-asc",
    },
    {
      label: "Reminder Desc",
      value: "reminder-desc",
    },
    {
      label: "Newest First",
      value: "newest",
    },
    {
      label: "Olderst Firstc",
      value: "oldest",
    },
    {
      label: "Last Name Asc",
      value: "lastname-asc",
    },
    {
      label: "Last Name Desc",
      value: "lastname-desc",
    },
  ],
};

const ColorOptionRender = ({ value, label, color, onClick }) => {
  const handleClick = (ev) => {
    onClick && onClick(ev, value);
  };
  return (
    <div className="option" onClick={handleClick}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 5,
        }}
      />
      <span>{label}</span>
    </div>
  );
};

export const WithCustomOptionRender = Template.bind({});
WithCustomOptionRender.args = {
  initialValue: "red",
  placeholder: "- Choose Color -",
  Option: ColorOptionRender,
  options: [
    {
      label: "Red",
      value: "red",
      color: "#ff0000",
    },
    {
      label: "Green",
      value: "green",
      color: "#00ff00",
    },
    {
      label: "Blue",
      value: "blue",
      color: "#0000ff",
    },
  ],
};

export const ShowValueAsLabel = Template.bind({});
ShowValueAsLabel.args = {
  initialValue: "r-asc",
  placeholder: "- Sort by -",
  Option: DefaultOption,
  showValueasLabel: true,
  options: [
    {
      label: "Reminder Asc",
      value: "r-asc",
    },
    {
      label: "Reminder Desc",
      value: "r-desc",
    },
    {
      label: "Newest First",
      value: "newest",
    },
    {
      label: "Olderst Firstc",
      value: "oldest",
    },
    {
      label: "Last Name Asc",
      value: "lname-asc",
    },
    {
      label: "Last Name Desc",
      value: "lname-desc",
    },
  ],
};

export const OpenOptionsByDefalut = Template.bind({});
OpenOptionsByDefalut.args = {
  initialValue: "r-asc",
  placeholder: "- Sort by -",
  Option: DefaultOption,
  isDefaultOpen: true,
  options: [
    {
      label: "Reminder Asc",
      value: "r-asc",
    },
    {
      label: "Reminder Desc",
      value: "r-desc",
    },
    {
      label: "Newest First",
      value: "newest",
    },
    {
      label: "Olderst Firstc",
      value: "oldest",
    },
    {
      label: "Last Name Asc",
      value: "lname-asc",
    },
    {
      label: "Last Name Desc",
      value: "lname-desc",
    },
  ],
};

// Add more Select stories here
