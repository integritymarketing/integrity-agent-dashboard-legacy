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
  await plansService.filterPlans(123, {});
  expect(_clientAPIRequest).toHaveBeenCalledTimes(1);
  expect(_clientAPIRequest).toHaveBeenCalledWith(
    "Lead/123/Plan/PlansByFilter",
    "POST",
    {}
  );
});

it("plansService filterPlans with filter", async () => {
  const mockResponse = new Response();
  const json = jest.spyOn(mockResponse, "json");
  json.mockReturnValue({ medicarePlans: [] });
  plansService._clientAPIRequest.mockResolvedValue(mockResponse);
  const plansFilter = {
    year: 2022,
  };
  await plansService.filterPlans(123, plansFilter);
  expect(_clientAPIRequest).toHaveBeenCalledTimes(1);
  expect(_clientAPIRequest).toHaveBeenCalledWith(
    "Lead/123/Plan/PlansByFilter",
    "POST",
    plansFilter
  );
});
