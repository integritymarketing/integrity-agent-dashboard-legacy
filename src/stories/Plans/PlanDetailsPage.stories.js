import React from "react";
import withMock from "storybook-addon-mock";
import PlanDetailsPage from "pages/PlanDetailsPage";
import { MemoryRouter, Route } from "react-router-dom";
import "../../index.scss";
import { HelmetProvider } from "react-helmet-async";

// spoof logged in user
localStorage.setItem(
  "oidc.user:https://ae-api-dev.integritymarketinggroup.com/ae-identity-service:AEPortal",
  JSON.stringify({ id: 1, access_token: "a" })
);

export default {
  component: PlanDetailsPage,
  title: "Pages/PlanDetailsPage",
  decorators: [withMock],
};
const Template = () => (
  <HelmetProvider>
    <MemoryRouter initialEntries={["/plan/123"]}>
      <Route path="/plan/:planId">
        <PlanDetailsPage />
      </Route>
    </MemoryRouter>
  </HelmetProvider>
);

export const PlanDetailsPageSuccess = Template.bind({});
PlanDetailsPageSuccess.parameters = {
  mockData: [],
};
