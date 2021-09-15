import authService from "services/authService";

export const QUOTES_API_VERSION = "v1.0";

class PlansService {
  getPlans = async (leadId, plansFilter) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/Plan/Plans`,
      "GET",
      plansFilter
    );

    return response.json();
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

    return fetch(url, opts);
  };
}

export default new PlansService();
