import authService from "services/authService";

export const QUOTES_API_VERSION = "v1.0";

class PlansService {
  filterPlans = async (leadId, plansFilter) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/Plan/PlansByFilter`,
      "POST",
      plansFilter
    );

    return response.json();
  };
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

    return fetch(
      `${process.env.REACT_APP_QUOTES_URL}/api/${QUOTES_API_VERSION}/` + path,
      opts
    );
  };
}

export default new PlansService();
