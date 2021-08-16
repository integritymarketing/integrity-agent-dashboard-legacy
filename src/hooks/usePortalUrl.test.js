import usePortalUrl from "hooks/usePortalUrl";

describe("usePortalUrl", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // important clear the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("returns portal url when no cookie present", () => {
    process.env.REACT_APP_PORTAL_URL = "http://test.com";
    expect(usePortalUrl()).toBe(process.env.REACT_APP_PORTAL_URL);
  });

  it("returns returns client_url value when client_url cookie present", () => {
    document.cookie = "client_url=http://test.com";
    expect(usePortalUrl()).toBe("http://test.com");
  });

  it("returns returns portal_url value when portal_url cookie present", () => {
    document.cookie = "portal_url=http://test-portal-url.com";
    expect(usePortalUrl()).toBe("http://test-portal-url.com");
  });

  it("returns returns portal_url value when both portal_url and client_url cookie present", () => {
    document.cookie =
      "portal_url=http://test-portal-url.com; client_url=http://test.com";
    expect(usePortalUrl()).toBe("http://test-portal-url.com");
  });
});
