import authService from "services/authService";
import dateFnsParse from "date-fns/parse";
import dateFnsFormat from "date-fns/format";

const parseDate = (dateString) => {
  return dateFnsParse(dateString, "MM/dd/yyyy", new Date());
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return dateFnsFormat(date, "yyyy-MM-dd");
};

class ClientsService {
  _clientAPIRequest = async (path, method = "GET", body) => {
    const user = await authService.getUser();
    const opts = {
      method,
      headers: {
        Authorization: "Bearer " + user.access_token,
        "Content-Type": "application/json",
      },
    };
    if (body) {
      opts.body = JSON.stringify(body);
    }

    return fetch(path, opts);
  };

  getList = async (page, pageSize, sort) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads?PageSize=${pageSize}&CurrentPage=${page}&Sort=${sort}`
    );
    if (response.status >= 400) {
      throw new Error("Leads request failed.");
    }
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
      product: "",
      leadStatusId: 1,
      statusName: "New",
    };
  };

  getClient = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads/${id}`
    );

    return response;
  };

  _getFormattedData = (
    { phone, followUpDate, email, leadStatusId, ...data },
    baseValues = {}
  ) => {
    return Object.assign({}, baseValues, data, {
      email: email || null,
      phone: phone ? ("" + phone).replace(/\D/g, "") : null,
      followUpDate: followUpDate ? formatDate(parseDate(followUpDate)) : null,
      leadStatusId: parseInt(leadStatusId, 10),
    });
  };

  createClient = async (data) => {
    const reqData = this._getFormattedData(data);
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads`,
      "POST",
      reqData
    );

    return response;
  };

  updateClient = async (oldValues, data) => {
    const reqData = this._getFormattedData(data, oldValues);
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/Leads/${oldValues.leadsId}`,
      "PUT",
      reqData
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
