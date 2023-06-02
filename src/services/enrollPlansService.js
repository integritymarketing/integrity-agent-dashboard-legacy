import authService from "services/authService";

export const QUOTES_API_VERSION = "v1.0";

class EnrollPlansService {
  getEnrollPlans = async (leadId) => {
    const response = await this._clientAPIRequest(`lead/${leadId}`, "GET", {
      LeadId: leadId,
    });

    return response?.json();
  };

  getPolicySnapShotList = async (npn, dateRange, status) => {
    const response = await this._clientAPIRequest(
      `summary/${npn}/${dateRange}/${status}`,
      "GET"
    );

    return response?.json();
  };

  getPolicySnapShotCount = async (npn, dateRange) => {
    const response = await this._clientAPIRequest(
      `policycount/${npn}/${dateRange}`,
      "GET"
    );

    return response?.json();
  };

  updateBookOfBusiness = async (updateBookPayload) => {
    const response = await this._clientAPIRequest(
      "",
      "PUT",
      "",
      updateBookPayload
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
      `https://ae-api-dev.integritymarketinggroup.com/ae-enrollment-service/api/${QUOTES_API_VERSION}/BookOfBusiness/` +
        path
    );
    url.search = new URLSearchParams(query).toString();

    if (body) {
      opts.body = JSON.stringify(body);
    }

    return fetch(url.toString(), opts);
  };
}

export default new EnrollPlansService();
