import authService from "services/authService";
import { parseDate, formatServerDate } from "utils/dates";
import moment from "moment";

export const LEADS_API_VERSION = "v2.0";
export const QUOTES_API_VERSION = "v1.0";
export const AGENTS_API_VERSION = "v1.0";
const rangeDateFormat = "yyyyMMDD";

const getSortByRangeDates = (type) => {
  if (type === "current-year-to-date") {
    return [
      moment().startOf("year").format(rangeDateFormat),
      moment().format(rangeDateFormat),
    ];
  } else if (type === "last-week") {
    return [
      moment().subtract(1, "week").startOf("isoWeek").format(rangeDateFormat),
      moment().subtract(1, "week").endOf("isoWeek").format(rangeDateFormat),
    ];
  } else if (type === "last-month") {
    return [
      moment().subtract(1, "month").startOf("month").format(rangeDateFormat),
      moment().subtract(1, "month").endOf("month").format(rangeDateFormat),
    ];
  } else if (type === "last-quarter") {
    return [
      moment().subtract(1, "Q").startOf("Q").format(rangeDateFormat),
      moment().subtract(1, "Q").endOf("Q").format(rangeDateFormat),
    ];
  }
  return [
    moment().startOf("year").format(rangeDateFormat),
    moment().format(rangeDateFormat),
  ];
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

  _clientPublicAPIRequest = async (path, method = "GET", body) => {
    const opts = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return fetch(path, opts);
  };

  getList = async (
    page,
    pageSize,
    sort,
    searchText,
    leadIds,
    contactRecordType = "",
    stages = [],
    hasReminder = false
  ) => {
    let params = {
      PageSize: pageSize,
      CurrentPage: page,
      Sort: sort,
      Search: searchText,
      leadIds,
    };
    if (hasReminder) {
      params.HasReminder = hasReminder;
    }
    if (contactRecordType !== "") {
      params.ContactRecordType = contactRecordType;
    }
    if (stages && stages.length > 0) {
      params.Stage = stages;
    }

    const queryStr = Object.keys(params)
      .map((key) => {
        if (key === "leadIds" && leadIds) {
          return (params[key] || [])
            .map((leadId) => `${key}=${leadId}`)
            .join("&");
        }
        if (key === "Stage") {
          return stages.map((stageId) => `${key}=${stageId}`).join("&");
        }
        return params[key] ? `${key}=${params[key]}` : null;
      })
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

  bulkExportContacts = async (reqData) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/bulkexport`,
      "POST",
      reqData
    );

    if (response.ok) {
      return response;
    }
    throw new Error("Update failed.");
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

  reActivateClients = async (data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/reactivate`,
      "PUT",
      data
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

  deleteContactLeads = async (leadsId) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads`,
      "DELETE",
      leadsId
    );

    return response;
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

  deleteActivity = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Activities/${id}`,
      "DELETE"
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

  updateLead = async (contact) => {
    const {
      firstName,
      middleName,
      lastName,
      birthdate,
      email,
      phones,
      address,
      primaryCommunication,
      contactRecordType,
      leadsId,
      leadStatusId,
      emailID,
      phoneId,
      leadAddressId,
      notes,
    } = contact;
    const reqData = {
      leadsId,
      firstName,
      middleName: middleName?.toUpperCase(),
      lastName,
      birthdate: birthdate ? formatServerDate(parseDate(birthdate)) : null,
      leadStatusId,
      primaryCommunication,
      contactRecordType,
      notes,
    };
    reqData.emails = [];
    if (email !== null && email !== undefined) {
      reqData.emails = [
        {
          emailID: emailID,
          leadEmail: email,
        },
      ];
    }

    reqData.phones = [
      {
        phoneId: phoneId,
        ...phones,
        leadPhone: this._getFormattedPhone(phones.leadPhone),
      },
    ];

    reqData.addresses = [
      {
        leadAddressId: leadAddressId,
        ...address,
      },
    ];

    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${reqData.leadsId}`,
      "PUT",
      reqData
    );

    return response;
  };

  getDuplicateContact = async (contact) => {
    const { firstName, lastName, email, phones, leadId = 0 } = contact;
    const reqData = {
      firstName,
      lastName,
      leadId,
    };
    // don't attempt call if either are empty
    // as it will throw a 400 and fill up the logs.
    if (!email && !phones?.leadPhone) {
      return {};
    }

    if (email) {
      reqData.emails = [
        {
          leadEmail: email,
        },
      ];
    }
    if (phones?.leadPhone) {
      reqData.phones = [
        {
          ...phones,
          leadPhone: this._getFormattedPhone(phones.leadPhone),
        },
      ];
    }

    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/GetDuplicateContact`,
      "POST",
      reqData
    );
    return response;
  };

  addNewContact = async (contact) => {
    const {
      firstName,
      lastName,
      middleName,
      birthdate,
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
      middleName: middleName?.toUpperCase(),
      birthdate: birthdate ? formatServerDate(parseDate(birthdate)) : null,
      leadStatusId: 0,
      contactRecordType,
    };

    if (primaryCommunication === "") {
      reqData.primaryCommunication = email !== "" ? "email" : "phone";
    } else {
      reqData.primaryCommunication = primaryCommunication;
    }

    if (email) {
      reqData.emails = [
        {
          emailID: 0,
          leadEmail: email,
        },
      ];
    }
    reqData.phones = [
      {
        phoneId: 0,
        ...phones,
        leadPhone: this._getFormattedPhone(phones.leadPhone),
      },
    ];
    reqData.addresses = [
      {
        leadAddressId: 0,
        ...address,
      },
    ];
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/`,
      "POST",
      reqData
    );

    return response;
  };

  getContactPreferences = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/ContactPreferences/${id}`,
      "GET"
    );

    return response.json();
  };

  createContactPreferences = async (leadsId, payload) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/ContactPreferences`,
      "POST",
      { leadsId, ...payload }
    );

    if (response.ok) {
      return response;
    }
    throw new Error("Update failed.");
  };

  updateContactPreferences = async (id, payload) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/ContactPreferences/${id}`,
      "PUT",
      payload
    );

    if (response.ok) {
      return response.json();
    }
    throw new Error("Update failed.");
  };

  getCounties = async (zipcode) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/v1.0/Search/GetCounties?zipcode=${zipcode}`,
      "GET"
    );

    return response.json();
  };

  getLeadPharmacies = async (leadId) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Pharmacies`,
      "GET"
    );

    return response.json().then((res) => res || []);
  };

  getLeadProviders = async (leadId) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Provider`,
      "GET"
    );

    return response.json().then((res) => res || []);
  };

  getLeadPrescriptions = async (leadId) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions`,
      "GET"
    );
    return response.json().then((res) => res || []);
  };

  createPrescription = async (leadId, reqData) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions`,
      "POST",
      reqData
    );
    if (response.ok) {
      return response;
    }
    throw new Error("Update failed.");
  };

  editPrescription = async (leadId, reqData, method = "PUT") => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions/${reqData.dosageRecordID}`,
      method,
      reqData
    );

    if (response.ok) {
      return response.json();
    }
    throw new Error("Update failed.");
  };

  deletePrescription = async (leadId, id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions/${id}`,
      "DELETE"
    );

    return response;
  };

  getDrugNames = async (drugName) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Search/DrugName?drugName=${drugName}`,
      "GET"
    );
    return response.json();
  };

  getDrugDetails = async (drugID) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Search/DrugDetail?id=${drugID}`,
      "GET"
    );
    return response.json();
  };

  deletePharmacy = async (leadId, id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Pharmacies/${id}`,
      "DELETE"
    );

    return response;
  };

  createPharmacy = async (leadId, reqData) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Pharmacies`,
      "POST",
      reqData
    );
    if (response.ok) {
      return response;
    }
    throw new Error("Update failed.");
  };

  getLeadProviders = async (leadId) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Provider/ProviderSearchLookup`,
      "GET"
    );

    return response.json();
  };

  createLeadProvider = async (leadId, data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Provider`,
      "POST",
      data
    );

    if (response.ok) {
      return response;
    }
    throw new Error("Create Lead failed.");
  };

  deleteProvider = async (addressId, leadId, npi) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Provider/${npi}?addressId=${addressId}`,
      "DELETE"
    );
    if (response.ok) {
      return response;
    }
    throw new Error("Delete Lead failed.");
  };

  searchProviders = async (query) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Search/Providers?${query}`,
      "GET"
    );

    return response.json();
  };

  searchPharmacies = async (payload) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Search/Pharmacies`,
      "POST",
      payload
    );

    return response.json();
  };

  getLatlongByAddress = async (zipcode, address) => {
    const opts = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address} ${zipcode}.json?limit=1&types=address&access_token=${process.env.REACT_APP_MAPBOX_GEO_TOKEN}
        `,
      opts
    );

    return response.json();
  };

  sendSoaInformation = async (payload, leadsId) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/v2.0/lead/${leadsId}/Soa`,
      "POST",
      payload
    );

    if (response.ok) {
      return response;
    }
    throw new Error("Failed to send soa information.");
  };

  getSoaListByLeadId = async (leadsId) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/v2.0/lead/${leadsId}/Soa`,
      "GET"
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error("Failed to Get soa list by lead Id.");
  };

  getSoaByLinkCode = async (leadsId, linkCode) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/v2.0/lead/${leadsId}/Soa/${linkCode}`,
      "GET"
    );

    return response.json();
  };

  getSoaStatusByLinkCode = async (linkCode) => {
    const response = await this._clientPublicAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Soa/${linkCode}`,
      "GET"
    );

    return response.json();
  };

  saveSoaInformationForLeadByLinkCode = async (payload, linkCode) => {
    const response = await this._clientPublicAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Soa/${linkCode}`,
      "POST",
      payload
    );

    if (response.ok) {
      return response;
    }
    throw new Error("Failed to send soa information.");
  };
  saveSOAInformation = async (linkCode, payload) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Soa/${linkCode}`,
      "POST",
      payload
    );

    if (response.ok) {
      return response;
    }
  };

  /*Start Dashboard API */

  getDashbaordSummary = async () => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/summary`,
      "GET"
    );

    return response.json();
  };

  getApplicationCount = async (sortByRange) => {
    const [startDate, endDate] = getSortByRangeDates(sortByRange);
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/appCount?startdate=${startDate}&enddate=${endDate}`,
      "GET"
    );

    return response.json();
  };

  getAgents = async (npn) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/Agents/rts/${npn}`,
      "GET"
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  };

  /*End Dashboard API */

  /*Start purl API calls */

  getAgentPurlCodeByNPN = async (agentnpn) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/Purl/npn/${agentnpn}`,
      "GET"
    );
    return response.json();
  };

  createAgentPurlCode = async (payload) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/Purl`,
      "POST",
      payload
    );
    if (response.ok) {
      return response;
    }
  };

  updateAgentAvailability = async (payload) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentMobile/Availability`,
      "POST",
      payload
    );
    if (response.ok) {
      return response;
    }
  };

  getAgentAvailability = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentMobile/Available/${id}`,
      "GET"
    );
    return response.json();
  };
  /*End purl API calls */
}

export default new ClientsService();
