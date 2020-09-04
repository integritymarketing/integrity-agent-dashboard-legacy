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
  getList = async (page, sort, sortDir = "desc") => {
    const user = await AuthService.getUser();
    const response = await fauxFetch(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads?PageSize=9&CurrentPage=${page}&Sort=${sort}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.access_token,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
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
    const user = await AuthService.getUser();
    const response = await fauxFetch(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.access_token,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    return response;
  };

  createClient = async (data) => {
    const user = await AuthService.getUser();
    const response = await fauxFetch(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + user.access_token,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    return response;
  };

  updateClient = async (id, data) => {
    const user = await AuthService.getUser();
    const response = await fauxFetch(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + user.access_token,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    return response;
  };
}

export default new ClientsService();
