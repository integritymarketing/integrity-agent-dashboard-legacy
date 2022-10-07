import React from "react";
import { Route } from "react-router-dom";
import { cleanup } from "@testing-library/react";

import { TestRouterWithAuth, renderWithRouter } from "utils/testing";

import AuthSigninCallback from "./auth-signin-callback";

const mockHistoryReplace = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

afterEach(cleanup);

// test("<AuthSigninCallback /> success, ", () => {
//   const mockAuthService = {
//     signinSilent: jest.fn(async () => {
//       return true;
//     }),
//   };

//   renderWithRouter(
//     <TestRouterWithAuth mockAuthService={mockAuthService}>
//       <Route path="/signin-oidc" component={AuthSigninCallback} />
//     </TestRouterWithAuth>,
//     {
//       route: "/signin-oidc",
//     }
//   );

//   expect(mockAuthService.signinSilent.mock.calls.length).toBe(1);
//   expect(mockHistoryReplace).toBeCalledTimes(0);
// });

// test("<AuthSigninCallback /> error, ", async () => {
//   const mockAuthService = {
//     signinSilent: jest.fn(async () => {
//       throw new Error(400);
//     }),
//   };

//   await renderWithRouter(
//     <TestRouterWithAuth mockAuthService={mockAuthService}>
//       <Route path="/signin-oidc" component={AuthSigninCallback} />
//     </TestRouterWithAuth>,
//     {
//       route: "/signin-oidc",
//     }
//   );

//   expect(mockAuthService.signinSilent.mock.calls.length).toBe(1);
//   expect(mockHistoryReplace).toBeCalledTimes(1);
// });
