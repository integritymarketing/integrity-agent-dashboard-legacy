import clientsService from "./clientsService";
import authService from "services/authService";
import * as dates from "utils/dates";
import { LEADS_API_VERSION } from "./clientsService";

process.env.REACT_APP_LEADS_URL = "mockUrl";

it("clientsService._clientAPIRequest", async () => {
  const mockGetUser = jest
    .fn()
    .mockResolvedValue({ access_token: "mockToken" });

  authService.getUser = mockGetUser;

  // TODO: Get mock fetch to work
  // const mockFetch = jest.fn().mockResolvedValue({ access_token: "mockToken" });
  // global.fetch = await mockFetch;
  // example assertion: expect(global.fetch).toHaveBeenCalledWith("mockPath");
  // Keep getting: 'Number of calls: 0'

  clientsService._clientAPIRequest("mockPath", "GET");
  expect(mockGetUser).toHaveBeenCalled();
});

it("clientsService.getList", async () => {
  const asyncMock = jest
    .fn()
    .mockResolvedValue({ json: () => Promise.resolve() });
  clientsService._clientAPIRequest = await asyncMock;
  clientsService.getList(1, 10);
  expect(asyncMock).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalledWith(
    `mockUrl/api/${LEADS_API_VERSION}/Leads?PageSize=10&CurrentPage=1`
  );
});

it("clientsService.getList, accepts sort param", async () => {
  const asyncMock = jest
    .fn()
    .mockResolvedValue({ json: () => Promise.resolve() });
  clientsService._clientAPIRequest = await asyncMock;
  clientsService.getList(1, 10, "ASC");
  expect(asyncMock).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalledWith(
    `mockUrl/api/${LEADS_API_VERSION}/Leads?PageSize=10&CurrentPage=1&Sort=ASC`
  );
});

it("clientsService.getList, accepts filterId param", async () => {
  const asyncMock = jest
    .fn()
    .mockResolvedValue({ json: () => Promise.resolve() });
  clientsService._clientAPIRequest = await asyncMock;
  clientsService.getList(1, 10, null, 1);
  expect(asyncMock).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalledWith(
    `mockUrl/api/${LEADS_API_VERSION}/Leads?PageSize=10&CurrentPage=1&FilterId=1`
  );
});

it("clientsService.getList, accepts searchText param", async () => {
  const asyncMock = jest
    .fn()
    .mockResolvedValue({ json: () => Promise.resolve() });
  clientsService._clientAPIRequest = await asyncMock;
  clientsService.getList(1, 10, null, null, "John");
  expect(asyncMock).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalledWith(
    `mockUrl/api/${LEADS_API_VERSION}/Leads?PageSize=10&CurrentPage=1&Search=John`
  );
});

it("clientsService.getList, throws error", async () => {
  const asyncMock = jest
    .fn()
    .mockResolvedValue({ status: 400, json: () => Promise.resolve() });
  clientsService._clientAPIRequest = await asyncMock;

  let err;

  try {
    await clientsService.getList(2, 7);
  } catch (e) {
    err = e;
  }

  expect(asyncMock).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalledWith(
    `mockUrl/api/${LEADS_API_VERSION}/Leads?PageSize=7&CurrentPage=2`
  );
  expect(err.message).toMatch("Leads request failed.");
});

it("clientsService.newClientObj", () => {
  const response = clientsService.newClientObj();
  expect(response.leadsId).toEqual(null);
  expect(response.email).toEqual("");
  expect(response.leadStatusId).toEqual(1);
  expect(response.statusName).toEqual("New");
});

it("clientsService.getClient", async () => {
  const asyncMock = jest.fn().mockResolvedValue("get");
  clientsService._clientAPIRequest = await asyncMock;
  clientsService.getClient(54321);
  expect(asyncMock).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalledWith(
    `mockUrl/api/${LEADS_API_VERSION}/Leads/54321`
  );
});

it("clientsService._getFormattedData, formats data", async () => {
  dates.formatServerDate = jest.fn().mockReturnValue("2020-10-26T05:14:23Z");
  dates.parseDate = jest.fn();

  const response = clientsService._getFormattedData({
    phone: "555-555-5555",
    leadStatusId: "1",
    followUpDate: "2020-10-26",
  });

  expect(response.phone).toEqual("5555555555");
  expect(response.leadStatusId).toEqual(1);
  expect(dates.formatServerDate).toHaveBeenCalledTimes(1);
  expect(dates.parseDate).toHaveBeenCalledTimes(1);
  expect(response.followUpDate).toEqual("2020-10-26T05:14:23Z");
});

it("clientsService._getFormattedData, combines old data and overwrites with new data", async () => {
  const response = clientsService._getFormattedData(
    {
      phone: "555-555-1234",
      email: "newemail@test.com",
    },
    {
      email: "test@test.com",
      notes: "test note",
      phone: "555-555-5555",
    }
  );

  expect(response.email).toEqual("newemail@test.com");
  expect(response.notes).toEqual("test note");
  expect(response.phone).toEqual("5555551234");
});

it("clientsService.createClient", async () => {
  const asyncMock = jest.fn().mockResolvedValue("post");
  const mockFormattedData = {
    email: "email@test.com",
    phone: "5555555555",
  };
  const mockGetFormattedData = jest.fn().mockReturnValue(mockFormattedData);
  clientsService._getFormattedData = mockGetFormattedData;
  clientsService._clientAPIRequest = await asyncMock;
  clientsService.createClient({
    email: "email@test.com",
    phone: "555-555-5555",
  });
  expect(mockGetFormattedData).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalledWith(
    `mockUrl/api/${LEADS_API_VERSION}/Leads`,
    "POST",
    mockFormattedData
  );
});

it("clientsService.updateClient", async () => {
  const asyncMock = jest.fn().mockResolvedValue("updated");
  const mockFormattedData = {
    email: "newemail@test.com",
    followUpDate: null,
    leadStatusId: 1,
    leadsId: 12345,
    phone: "5555555555",
  };
  const mockGetFormattedData = jest.fn().mockReturnValue(mockFormattedData);
  clientsService._getFormattedData = mockGetFormattedData;
  clientsService._clientAPIRequest = await asyncMock;
  clientsService.updateClient(
    {
      email: "oldemail@test.com",
      leadsId: 12345,
    },
    {
      email: "newemail@test.com",
      followUpDate: null,
      leadStatusId: 1,
      phone: "555-555-5555",
    }
  );
  expect(mockGetFormattedData).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalledWith(
    `mockUrl/api/${LEADS_API_VERSION}/Leads/12345`,
    "PUT",
    mockFormattedData
  );
});

it("clientsService.deleteClient", async () => {
  const asyncMock = jest.fn().mockResolvedValue("deleted");
  clientsService._clientAPIRequest = await asyncMock;
  clientsService.deleteClient(123);
  expect(asyncMock).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalledWith(
    `mockUrl/api/${LEADS_API_VERSION}/Leads/123`,
    "DELETE"
  );
});

it("clientsService.getStatuses", async () => {
  const asyncMock = jest
    .fn()
    .mockResolvedValue({ json: () => Promise.resolve() });
  clientsService._clientAPIRequest = await asyncMock;
  clientsService.getStatuses();
  expect(asyncMock).toHaveBeenCalled();
  expect(asyncMock).toHaveBeenCalledWith(
    `mockUrl/api/${LEADS_API_VERSION}/Leads/statuses`
  );
});
