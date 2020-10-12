import React from "react";
import { Route } from "react-router-dom";
import { cleanup } from "@testing-library/react";

import { TestRouterWithAuth, renderWithRouter } from "utils/testing";

import AuthSilentCallback from "./auth-silent-callback";

afterEach(cleanup);

test("<AuthSilentCallback />, ", () => {
  const mockAuthService = {
    signinSilentCallback: jest.fn(),
  };

  renderWithRouter(
    <TestRouterWithAuth mockAuthService={mockAuthService}>
      <Route path="/signin-oidc-silent" component={AuthSilentCallback} />
    </TestRouterWithAuth>,
    {
      route: "/signin-oidc-silent",
    }
  );

  expect(mockAuthService.signinSilentCallback).toHaveBeenCalledTimes(1);
});
