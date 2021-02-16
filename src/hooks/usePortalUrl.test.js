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
});
