export const QUOTES_API_VERSION = 'v.2.0';

export class PlansService {
  constructor(getAccessToken) {
    this.getAccessToken = getAccessToken;
  }

  getPlans = async (leadId, plansFilter) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/Plan`,
      'GET',
      plansFilter
    );

    return response?.json();
  };

  getPlan = async (
    leadId,
    planId,
    contactData,
    effectiveDate,
    primaryPharmacy
  ) => {
    if (!contactData) return;
    const params = {
      zip: contactData?.addresses?.[0]?.postalCode,
      fips: contactData?.addresses?.[0]?.countyFips,
      effectiveDate,
    };
    if (primaryPharmacy) {
      params.pharmacyId = primaryPharmacy;
    }
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/Plan/${planId}`,
      'GET',
      params
    );

    return response?.json();
  };

  enroll = async (leadId, planId, data) => {
    const response = await this._clientAPIRequest(
      `Lead/${leadId}/Enroll/${planId}`,
      'POST',
      {},
      data
    );

    return response?.json();
  };

  enrollConsumerView = async (leadId, planId, data, agentNPN) => {
    const response = await this._clientPublicAPIRequest(
      `${
        import.meta.env.VITE_QUOTE_URL
      }/api/v2.0/Lead/${leadId}/Enroll/${planId}`,
      'POST',
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
      'POST',
      {},
      data,
      'v1.0'
    );
    if (response?.ok) {
      return response?.text();
    }
    throw new Error(response?.statusText);
  };

  resendCode = async data => {
    const response = await this._clientPublicAPIRequest(
      `${
        import.meta.env.VITE_QUOTE_URL
      }/api/${QUOTES_API_VERSION}/Plan/ResendPasscode`,
      'POST',
      data
    );

    if (response?.ok) {
      return response?.json();
    }
    throw new Error(response?.statusText);
  };

  sendPlanCompare = async data => {
    const response = await this._clientAPIRequest(
      `Plan/PlanCompare`,
      'POST',
      {},
      data,
      'v1.0'
    );

    if (response?.ok) {
      return response;
    }
    throw new Error(response?.statusText);
  };

  getPassCodeToken = async token => {
    const response = await this._clientPublicAPIRequest(
      `${import.meta.env.VITE_QUOTE_URL}/passcode/${token}?api-version=1.0`,
      'GET'
    );
    return response?.json();
  };

  _clientAPIRequest = async (path, method = 'GET', query, body, version) => {
    const versionPath = version ? version : QUOTES_API_VERSION;
    const accessToken = await this.getAccessToken();
    const opts = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const url = new URL(
      `${import.meta.env.VITE_QUOTE_URL}/api/${versionPath}/${path}`
    );
    url.search = new URLSearchParams(query).toString();

    if (body) {
      opts.body = JSON.stringify(body);
    }

    return fetch(url.toString(), opts);
  };

  _clientPublicAPIRequest = (path, method = 'GET', body, headers = {}) => {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    if (body) {
      opts.body = JSON.stringify(body);
    }

    return fetch(path, opts);
  };
}
