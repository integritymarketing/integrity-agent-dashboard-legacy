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

  _clientAPIRequest = async (url, method = "GET", query, body) => {
    const accessToken = await this.getAccessToken();
    const opts = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const urlObject = new URL(url);
    urlObject.search = new URLSearchParams(query)?.toString();

    if (body) {
      opts.body = JSON.stringify(body);
    }

    return fetch(urlObject.toString(), opts);
  };
}
