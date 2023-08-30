import authService from "services/authService";

export const QUOTES_API_VERSION = "v1.0";

class ComparePlansService {
  getLeadPharmacies = async (leadId, agentNPN) => {
    const response = await this._clientPublicAPIRequest1(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Pharmacies`,
      "GET",
      {
        AgentNPN: agentNPN,
      }
    );

    return response.json().then((res) => res || []);
  };

  getLeadPrescriptions = async (leadId, agentNPN) => {
    const response = await this._clientPublicAPIRequest1(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions`,
      "GET",
      {
        AgentNPN: agentNPN,
      }
    );
    return response.json().then((res) => res || []);
  };

  getPlan = async (leadId, planId, agentInfo, effectiveDate, agentNPN) => {
    const response = await this._clientPublicAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Plan/${planId}`,
      "GET",
      {
        zip: agentInfo?.ZipCode,
        fips: agentInfo?.CountyFIPS,
        effectiveDate,
      },
      null,
      {
        AgentNPN: agentNPN,
      }
    );

    return response.json();
  };

  _clientPublicAPIRequest = async (
    path,
    method = "GET",
    query = {},
    body,
    headers = {}
  ) => {
    const opts = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    let url = path;
    if (query !== null) {
      url = path + "?" + new URLSearchParams(query).toString();
    }

    if (body) {
      opts.body = JSON.stringify(body);
    }
    return fetch(url, opts);
  };

  _clientPublicAPIRequest1 = async (path, method = "GET", headers = {}) => {
    const opts = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    return fetch(path, opts);
  };

  getPdfSource = async (URL, agentNPN) => {
    const user = await authService.getUser();
    const response = await this._clientPublicAPIRequest(
      URL,
      "GET",
      null,
      undefined,
      {
        AgentNPN: agentNPN || user?.profile.npn,
        Authorization: "Bearer " + user.access_token,
      }
    );
    console.log("MOBILE TESTING ....:", response);
    return response.blob();
  };
}

const ComparePlansServiceInstance = new ComparePlansService();

export default ComparePlansServiceInstance;
