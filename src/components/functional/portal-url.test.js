import React from "react";
import PortalUrl from "./portal-url";

import {
  renderWithRouter,
  TestRouterWithAuth,
  getCookiesMap,
} from "utils/testing";

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
    // neither work for faking the domain, so we can grab cookie in this domain
    // document.domain = "test.com";
    // window.location = new URL("https://test.com/");
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("it sets a portal_url cookie if not already set or does not match env.REACT_APP_PORTAL_URL ", () => {
    process.env.REACT_APP_PORTAL_URL = "http://";

    const mockAuthService = { isAuthenticated: jest.fn(() => false) };
    myTestRouter(mockAuthService);

    let cookies = getCookiesMap(document.cookie);

    // couldn't find a way to fake the document domain
    // so covering test w/ a non-domain
    expect(cookies.portal_url).toBe("http%3A%2F%2F");
  });
});
