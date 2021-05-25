import authService from "services/authService";
import { parseDate, formatServerDate } from "utils/dates";

export const LEADS_API_VERSION = "v2.0";

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

  _getFormattedPhone = (phone) =>
    phone ? ("" + phone).replace(/\D/g, "") : null;

  _getFormattedData = (
    { phone, followUpDate, email, leadStatusId, ...data },
    baseValues = {}
  ) => {
    return Object.assign({}, baseValues, data, {
      email: email || null,
      phone: this._getFormattedPhone(phone),
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
    if (response.ok) {
      return response;
    }
    throw new Error("Update failed.");
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
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${id}`
    );

    return response.json();
  };

  createReminder = async (data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Reminders`,
      "POST",
      data
    );

    return response.json();
  };

  updateReminder = async (data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Reminders/${data.leadId}`,
      "PUT",
      data
    );

    return response.json();
  };

  deleteReminder = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Reminders/${id}`,
      "DELETE"
    );

    return response;
  };

  createActivity = async (data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Activities`,
      "POST",
      data
    );

    return response.json();
  };

  updateActivity = async (data, id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Activities/${id}`,
      "PUT",
      data
    );

    return response.json();
  };

  deleteClient = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${id}`,
      "DELETE"
    );

    return response;
  };

  updateLead = async (data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${data.leadsId}`,
      "PUT",
      data
    );
    if (response.ok) {
      return response;
    }
    throw new Error("Update failed.");
  };

  addNewContact = async (contact) => {
    const {
      firstName,
      lastName,
      email,
      phones,
      address,
      primaryCommunication,
      contactRecordType,
    } = contact;
    const reqData = {
      leadsId: 0,
      firstName,
      lastName,
      leadStatusId: 0,
      primaryCommunication,
      contactRecordType,
    };
    if (email) {
      reqData.emails = [
        {
          emailID: 0,
          leadEmail: email,
        },
      ];
    }
    if (phones?.leadPhone) {
      reqData.phones = [
        {
          phoneId: 0,
          ...phones,
          leadPhone: this._getFormattedPhone(phones.leadPhone),
        },
      ];
    }
    if (address?.address1) {
      reqData.addresses = [
        {
          leadAddressId: 0,
          ...address,
        },
      ];
    }
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/`,
      "POST",
      reqData
    );

    return response;
  };
}

export default new ClientsService();
