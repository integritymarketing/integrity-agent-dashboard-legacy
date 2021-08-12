import useClientUrl from "hooks/auth/useClientUrl";

describe("useClientUrl", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // important clear the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("returns default client url when no cookie present", () => {
    expect(useClientUrl()).toBe("https://www.medicarecenter.com");
  });
});
