import React from "react";
import { addDecorator } from "@storybook/react";
import { MemoryRouter } from "react-router";
import "!style-loader!css-loader!sass-loader!../src/scss/_theme.scss";
import "!style-loader!css-loader!sass-loader!../src/scss/_typography.scss";

addDecorator((story) => (
  <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
));

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
