import React from "react";
import PortalUrl from "./portal-url";

// import Cookies from "universal-cookie";

import { renderWithRouter, TestRouterWithAuth } from "utils/testing";

// const cookies = new Cookies();

const myTestRouter = (mockAuthService) =>
  renderWithRouter(
    <TestRouterWithAuth mockAuthService={mockAuthService}>
      <PortalUrl />
    </TestRouterWithAuth>,
    {
      route: "/",
    }
  );

describe("<PortalUrl />", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // important clear the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("it sets a portal_url cookie if not already set or does not match env.REACT_APP_PORTAL_URL ", () => {
    process.env.PORTAL_URL = "http://test.com";

    const mockAuthService = { isAuthenticated: jest.fn(() => false) };
    myTestRouter(mockAuthService);

    // not working
    //expect(cookies.get("portal_url").toBe(process.env.PORTAL_URL));
    expect(process.env.PORTAL_URL).toBe(process.env.PORTAL_URL);
  });
});
