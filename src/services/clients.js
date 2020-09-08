import AuthService from "services/auth";

// TODO: remove and replace with default fetch when API is
const fauxFetch = async (url, options) => {
  console.log("Faux Fetch Request", url, options);
  await new Promise((resolve) => setTimeout(() => resolve(), 1000));
  return {
    status: 200,
    json: async () => [
      {
        leadsId: 1,
        firstName: "Test",
        lastName: "Person",
        statusName: "Closed: Lost",
        followUpDate: "2020-01-01T00:00:00",
        email: "emailaddress@website.com",
        phone: "6515551234",
        notes: "Test notes",
      },
      {
        leadsId: 2,
        firstName: "FirstName",
        lastName: "LastName",
        statusName: "Closed: Lost",
        followUpDate: "2020-01-01T00:00:00",
        email: "emailaddress@website.com",
        phone: "6515551234",
        notes: "",
      },
      {
        leadsId: 3,
        firstName: "FirstName",
        lastName: "LastName",
        statusName: "Closed: Lost",
        followUpDate: "2020-01-01T00:00:00",
        email: "emailaddress@website.com",
        phone: "6515551234",
        notes: "",
      },
      {
        leadsId: 4,
        firstName: "FirstName",
        lastName: "LastName",
        statusName: "Closed: Lost",
        followUpDate: "2020-01-01T00:00:00",
        email: "emailaddress@website.com",
        phone: "6515551234",
        notes: "",
      },
    ],
  };
};

class ClientsService {
  _clientAPIRequest = async (path, method = "GET", body) => {
    const user = await AuthService.getUser();
    const opts = {
      method,
      headers: {
        Authorization: "Bearer " + user.access_token,
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    if (body) {
      opts.body = JSON.stringify(body);
    }
    console.log("Bearer " + user.access_token);
    const response = await fetch(path, opts);
    return response;
  };

  getList = async (page, sort) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads?PageSize=9&CurrentPage=${page}&Sort=${sort}`
    );
    const list = await response.json();

    return list;
  };

  newClientObj = () => {
    return {
      leadsId: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postalCode: "",
      notes: "",
      followUpDate: "",
      leadStatusId: 4,
      statusName: "Open",
    };
  };

  getClient = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads/${id}`
    );

    return response;
  };

  createClient = async (data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads`,
      "POST",
      data
    );

    return response;
  };

  updateClient = async (id, data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads/${id}`,
      "PUT",
      data
    );

    return response;
  };

  deleteClient = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads/${id}`,
      "DELETE"
    );

    return response;
  };

  getStatuses = async () => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/statuses`
    );

    return response.json();
  };
}

export default new ClientsService();
