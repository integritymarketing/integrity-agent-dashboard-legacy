import React from "react";
import { addDecorator } from "@storybook/react";
import { MemoryRouter } from "react-router";

addDecorator(story => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      method: "",
      order: ["Design System", "Examples"],
      locales: "",
    },
  },
};
