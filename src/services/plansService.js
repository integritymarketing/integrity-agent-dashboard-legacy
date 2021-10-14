import authService from "services/authService";

export const QUOTES_API_VERSION = "v1.0";

class PlansService {
  getPlans = async (leadId, plansFilter) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/Plan`,
      "GET",
      plansFilter
    );

    return response.json();
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

    return response.json();
  };
  enroll = async (leadId, planId, data) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/Enroll/${planId}`,
      "POST",
      {},
      data
    );

    return response.json();
  };
  sendPlan = async (data, leadId, planId) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/SendPlan/${planId}`,
      "POST",
      {},
      data
    );

    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  };

  _clientAPIRequest = async (path, method = "GET", query, body) => {
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
}

export default new PlansService();
