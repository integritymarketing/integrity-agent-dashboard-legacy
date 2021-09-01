import React from "react";
import AuthClientUrl from "./client-url";

import {
  renderWithRouter,
  TestRouterWithAuth,
  getCookiesMap,
} from "utils/testing";

const myTestRouter = (mockAuthService) =>
  renderWithRouter(
    <TestRouterWithAuth mockAuthService={mockAuthService}>
      <AuthClientUrl />
    </TestRouterWithAuth>,
    {
      route: "/",
    }
  );

describe("<AuthClientUrl />", () => {
  test("it correctly sets a client_url cookie when url search contains ?client_id=", () => {
    delete window.location;
    window.location = new URL(
      "https://www.testdomain.com/welcome?client_url=https://ae-dev.integritymarketinggroup.com"
    );

    const mockAuthService = { isAuthenticated: jest.fn(() => false) };
    myTestRouter(mockAuthService);

    let cookies = getCookiesMap(document.cookie);
    expect(cookies.client_url).toBe(
      "https%3A%2F%2Fae-dev.integritymarketinggroup.com"
    );
  });

  test("it correctly sets a client_url cookie when returnUrl has redirect_uri", () => {
    delete window.location;
    window.location = new URL(
      "https://www.testdomain.com/welcome?ReturnUrl=https%3A%2F%2Fae-api-dev.integritymarketinggroup.com%2Fae-identity-service%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3DTEST_CLIENT_ID%26redirect_uri%3Dhttps%253A%252F%252Fae-dev.integritymarketinggroup.com%252Fsignin-oidc%26response_type%3Dcode%26scope%3Dopenid%2520profile%2520email%2520IdentityServerApi%2520LeadsAPI_Full%2520phone%2520roles%2520QuoteService_Full%26state%3Dfbf3e9541fa34017b2c1f6a85da3335f%26code_challenge%3Djmi9gh6k480CmbcsSUTquEiiRI6Jm8banQvU4d8Sp_s%26code_challenge_method%3DS256%26response_mode%3Dquery"
    );

    const mockAuthService = { isAuthenticated: jest.fn(() => false) };
    myTestRouter(mockAuthService);

    let cookies = getCookiesMap(document.cookie);
    expect(cookies.client_url).toBe(
      "https%3A%2F%2Fae-dev.integritymarketinggroup.com"
    );
  });
});
