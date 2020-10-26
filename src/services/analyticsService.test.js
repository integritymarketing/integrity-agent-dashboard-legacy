import analyticsService from "./analyticsService";

describe("analyticsService", () => {
  it("clickClass", () => {
    const clickClass = analyticsService.clickClass(1234);
    expect(clickClass).toEqual("gtm-1234");
  });

  it("fireEvent", async () => {
    const mock_dataLayer = [];
    window.dataLayer = mock_dataLayer;
    analyticsService.fireEvent({ id: 1 });
    expect(mock_dataLayer).toHaveLength(1);
    expect(mock_dataLayer).toEqual([{ event: { id: 1 } }]);
  });

  it("fireEvent, with details", async () => {
    const mock_dataLayer = [];
    window.dataLayer = mock_dataLayer;
    analyticsService.fireEvent({ id: 2 }, { pathname: "/" });
    expect(mock_dataLayer).toHaveLength(1);
    expect(mock_dataLayer).toEqual([{ event: { id: 2 }, pathname: "/" }]);
  });
});
