import React from "react";
import withMock from "storybook-addon-mock";
import PlansPage from "pages/PlansPage";
import { MemoryRouter, Route } from "react-router-dom";
import "../../index.scss";
import { HelmetProvider } from "react-helmet-async";

// spoof logged in user
localStorage.setItem(
  "oidc.user:https://ae-api-dev.integritymarketinggroup.com/ae-identity-service:AEPortal",
  JSON.stringify({ id: 1, access_token: "a" })
);

export default {
  component: PlansPage,
  title: "Pages/PlansPage",
  decorators: [withMock],
};
const Template = () => (
  <HelmetProvider>
    <MemoryRouter initialEntries={["/plans/123"]}>
      <Route path="/plans/:contactId">
        <PlansPage />
      </Route>
    </MemoryRouter>
  </HelmetProvider>
);

export const PlansPageSuccess = Template.bind({});
PlansPageSuccess.parameters = {
  mockData: [
    {
      url: "https://ae-api-dev.integritymarketinggroup.com/ae-leads-api/api/v2.0/Leads/123",
      method: "GET",
      status: 200,
      response: {
        firstName: "Victoria",
        lastName: "Garcia",
        middleName: "R.",
        addresses: [
          {
            address1: "",
            address2: "",
            city: "",
            stateCode: "",
            postalCode: "92701",
          },
        ],
      },
    },
  ],
};
