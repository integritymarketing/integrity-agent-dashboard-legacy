import useClientId from "hooks/useClientId";

describe("useClientId", () => {
  it("returns AEPortal when no cookie present", () => {
    expect(useClientId()).toBe("AEPortal");
  });

  it("returns returns client_id value when cookie present", () => {
    document.cookie = "client_id=TEST_CLIENT_ID";
    expect(useClientId()).toBe("TEST_CLIENT_ID");
  });
});
