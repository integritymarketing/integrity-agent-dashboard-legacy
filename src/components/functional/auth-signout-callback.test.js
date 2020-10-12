import React from "react";
import { Route } from "react-router-dom";
import { cleanup } from "@testing-library/react";

import { TestRouterWithAuth, renderWithRouter } from "utils/testing";

import AuthSignoutCallback from "./auth-signout-callback";

afterEach(cleanup);

test("<AuthSignoutCallback />, ", () => {
  const mockAuthService = {
    signoutRedirectCallback: jest.fn(() => true),
  };

  renderWithRouter(
    <TestRouterWithAuth mockAuthService={mockAuthService}>
      <Route path="/signout-oidc" component={AuthSignoutCallback} />
    </TestRouterWithAuth>,
    {
      route: "/signout-oidc",
    }
  );

  expect(mockAuthService.signoutRedirectCallback).toHaveBeenCalledTimes(1);
});
