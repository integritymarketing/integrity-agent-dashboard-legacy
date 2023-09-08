import authService from "services/authService";

export const QUOTES_API_VERSION = "v1.0";

export class EnrollPlansService {

  getEnrollPlans = async (leadId) => {
    const url = new URL(
      `${process.env.REACT_APP_BOOKOFBUSINESS_API}/lead/${leadId}`
    );

    const response = await this._clientAPIRequest(url, "GET", {
      LeadId: leadId,
    });

    return response?.json();
  };

  getPolicySnapShotList = async (npn, dateRange, status) => {
    const url = new URL(
      `${process.env.REACT_APP_BOOKOFBUSINESS_API}/summary/${npn}/${dateRange}/${status}`
    );

    const response = await this._clientAPIRequest(url, "GET");

    return response?.json();
  };

  getPolicySnapShotCount = async (npn, dateRange) => {
    const url = new URL(
      `${process.env.REACT_APP_BOOKOFBUSINESS_API}/policycount/${npn}/${dateRange}`
    );

    const response = await this._clientAPIRequest(url, "GET");

    return response?.json();
  };

  getBookOfBusinessBySourceId = async (npn, id) => {
    const url = new URL(
      `${process.env.REACT_APP_BOOKOFBUSINESS_API}/${npn}/SourceId/${id}`
    );

    const response = await this._clientAPIRequest(url, "GET");
    return response?.json();
  };

  updateBookOfBusiness = async (updateBookPayload) => {
    const url = new URL(`${process.env.REACT_APP_BOOKOFBUSINESS_API}`);

    const response = await this._clientAPIRequest(
      url,
      "PUT",
      "",
      updateBookPayload
    );
    return response?.json();
  };

  enroll = async (leadId, planId, data) => {
    debugger
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_ENROLLMENT_SERVICE_API}/Medicare/Lead/${leadId}/Enroll/${planId}`,
      "POST",
      "",
      data
    );

    return response?.json();
  };

  sharePolicy = async (sharePolicyPayload) => {
    const url = new URL(
      `${process.env.REACT_APP_ENROLLMENT_SERVICE_API}/Medicare/ShareCurrentPlanSnapshot`
    );

    const response = await this._clientAPIRequest(
      url,
      "POST",
      "",
      sharePolicyPayload
    );
    return response?.json();
  };

  _clientAPIRequest = async (url, method = "GET", query, body) => {
    const user = await authService.getUser();
    const opts = {
      method,
      headers: {
        Authorization: "Bearer " + user.access_token,
        "Content-Type": "application/json",
      },
    };
    // Convert the URL string to a URL object
    const urlObject = new URL(url);
    urlObject.search = new URLSearchParams(query).toString();
    
    if (body) {
      opts.body = JSON.stringify(body);
    }
  
    return fetch(urlObject.toString(), opts);
  };
  
}

const EnrollPlansServiceInstance = new EnrollPlansService();

export default EnrollPlansServiceInstance;
