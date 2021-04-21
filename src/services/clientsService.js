import authService from "services/authService";
import { parseDate, formatServerDate } from "utils/dates";

export const LEADS_API_VERSION = "v1.0";
export const LEADS_API_VERSION_TWO = "v2.0"

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

  getList = async (page, pageSize, sort, filterId, searchText) => {
    const params = {
      PageSize: pageSize,
      CurrentPage: page,
      Sort: sort,
      FilterId: filterId,
      Search: searchText,
    };
    const queryStr = Object.keys(params)
      .map((key) => (params[key] ? `${key}=${params[key]}` : null))
      .filter((str) => str !== null)
      .join("&");
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads?${queryStr}`
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
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${id}`
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
      followUpDate: followUpDate
        ? formatServerDate(parseDate(followUpDate))
        : null,
      leadStatusId: parseInt(leadStatusId, 10),
    });
  };

  createClient = async (data) => {
    const reqData = this._getFormattedData(data);
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads`,
      "POST",
      reqData
    );

    return response;
  };

  bulkCreateClients = async (clients) => {
    const reqData = clients.map((client) => this._getFormattedData(client));
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/bulkuploadleads`,
      "POST",
      reqData
    );

    return response;
  };

  updateClient = async (oldValues, data) => {
    const reqData = this._getFormattedData(data, oldValues);
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${oldValues.leadsId}`,
      "PUT",
      reqData
    );

    return response;
  };

  deleteClient = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${id}`,
      "DELETE"
    );

    return response;
  };

  getStatuses = async () => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/statuses`
    );

    return response.json();
  };

  getContactInfo = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION_TWO}/Leads/${id}`
    );

    return response.json();
  };
}

export default new ClientsService();
