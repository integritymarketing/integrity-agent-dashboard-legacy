import plansService from "./plansService";

const _clientAPIRequest = jest.fn();
plansService._clientAPIRequest = _clientAPIRequest;

beforeEach(() => {
  _clientAPIRequest.mockReset();
});

it("plansService filterPlans with no filter", async () => {
  const mockResponse = new Response();
  const json = jest.spyOn(mockResponse, "json");
  json.mockReturnValue({ medicarePlans: [] });
  plansService._clientAPIRequest.mockResolvedValue(mockResponse);
  await plansService.getPlans(123, {
    year: 2022,
    planType: 1,
  });
  expect(_clientAPIRequest).toHaveBeenCalledTimes(1);
  expect(_clientAPIRequest).toHaveBeenCalledWith("Lead/123/Plan/Plans", "GET", {
    planType: 1,
    year: 2022,
  });
});
