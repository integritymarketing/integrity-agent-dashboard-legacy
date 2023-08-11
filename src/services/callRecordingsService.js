export const LEADS_API_VERSION = "v2.0";

export class CallRecordingsService {
  constructor(getAccessToken) {
    this.getAccessToken = getAccessToken;
  }

  getAllCallRecordingsByAgent = async () => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Call/Records`,
      "GET",
      { UnAssistedCallRecordingsOnly: true }
    );
    const data = await response.json();
    return data;
  };

  outboundCallFromMedicareCenter = async (data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Call/CallCustomer`,
      "POST",
      data
    );
    if (response.ok) {
      return response;
    }
    throw new Error("Update failed.");
  };

  assignsLeadToInboundCallRecord = async (data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Call/Records/AssignToLead`,
      "PUT",
      data
    );

    if (response.ok) {
      return response;
    }
    throw new Error(response?.statusText);
  };

  _clientAPIRequest = async (path, method = "GET", body) => {
    const accessToken = await this.getAccessToken();
    const opts = {
      method,
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    };
    if (method !== "GET" && method !== "HEAD" && body) {
      opts.body = JSON.stringify(body);
    }

    return fetch(path, opts);
  };
}
