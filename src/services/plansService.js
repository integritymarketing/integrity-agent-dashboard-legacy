import authService from "services/authService";

export const QUOTES_API_VERSION = "v1.0";

class PlansService {
  getPlans = async (leadId, plansFilter) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/Plan`,
      "GET",
      plansFilter
    );

    return response?.json();
  };

  getPlan = async (leadId, planId, contactData, effectiveDate) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/Plan/${planId}`,
      "GET",
      {
        zip: contactData.addresses[0].postalCode,
        fips: contactData.addresses[0].countyFips,
        effectiveDate,
      }
    );

    return response?.json();
  };

  enroll = async (leadId, planId, data) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/Enroll/${planId}`,
      "POST",
      {},
      data
    );

    return response?.json();
  };

  enrollConsumerView = async (leadId, planId, data, agentNPN) => {
    const response = await this._clientPublicAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/v1.0/Lead/${leadId}/Enroll/${planId}`,
      "POST",
      data,
      {
        AgentNPN: agentNPN,
      }
    );

    return response?.json();
  };

  sendPlan = async (data, leadId, planId) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/SendPlan/${planId}`,
      "POST",
      {},
      data
    );
    if (response?.ok) {
      return response?.text();
    }
    throw new Error(response?.statusText);
  };

  resendCode = async (data) => {
    const response = await this._clientPublicAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Plan/ResendPasscode`,
      "POST",
      data
    );

    if (response?.ok) {
      return response?.json();
    }
    throw new Error(response?.statusText);
  };

  sendPlanCompare = async (data) => {
    const response = await this._clientAPIRequest(
      `Plan/PlanCompare`,
      "POST",
      {},
      data
    );

    if (response?.ok) {
      return response;
    }
    throw new Error(response?.statusText);
  };

  getPassCodeToken = async (token) => {
    const response = await this._clientPublicAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/passcode/${token}?api-version=1.0`,
      "GET"
    );
    return response?.json();
  };

  _clientAPIRequest = async (path, method = "GET", query, body, bearer) => {
    const user = await authService.getUser();
    const opts = {
      method,
      headers: {
        Authorization: "Bearer " + user.access_token,
        "Content-Type": "application/json",
      },
    };

    const url = new URL(
      `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/` + path
    );
    url.search = new URLSearchParams(query).toString();

    if (body) {
      opts.body = JSON.stringify(body);
    }

    return fetch(url.toString(), opts);
  };

  _clientPublicAPIRequest = async (
    path,
    method = "GET",
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
    if (body) {
      opts.body = JSON.stringify(body);
    }

    return fetch(path, opts);
  };
}

export default new PlansService();