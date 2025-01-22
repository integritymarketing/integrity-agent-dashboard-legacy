export const QUOTES_API_VERSION = "v1.0";

export class ComparePlansService {
    constructor(getAccessToken, userProfile) {
        this.getAccessToken = getAccessToken;
        this.userProfile = userProfile;
    }

    getLeadPharmacies = async (leadId, agentNPN) => {
        const response = await this._clientPublicAPIRequest1(
            `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Pharmacies`,
            "GET",
            {
                AgentNPN: agentNPN,
            }
        );

        return response.json().then((res) => res || []);
    };

    getLeadPrescriptions = async (leadId, agentNPN) => {
        const response = await this._clientPublicAPIRequest1(
            `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions`,
            "GET",
            {
                AgentNPN: agentNPN,
            }
        );
        return response.json().then((res) => res || []);
    };

    getPlan = async (leadId, planId, agentInfo, effectiveDate, agentNPN, primaryPharmacy) => {
        const params = {
            zip: agentInfo?.ZipCode,
            fips: agentInfo?.CountyFIPS,
            effectiveDate,
        }
        if (primaryPharmacy) {
            params.pharmacyId = primaryPharmacy;
        }
        const response = await this._clientPublicAPIRequest(
            `${import.meta.env.VITE_QUOTE_URL}/api/v2.0/Lead/${leadId}/Plan/${planId}`,
             "GET", params, null,
            {
                AgentNPN: agentNPN,
            }
        );

        return response.json();
    };

    _clientPublicAPIRequest = (path, method = "GET", query = {}, body, headers = {}) => {
        const opts = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        };

        let url = path;
        if (query !== null) {
            url = `${path}?${new URLSearchParams(query).toString()}`;
        }

        if (body) {
            opts.body = JSON.stringify(body);
        }
        return fetch(url, opts);
    };

    _clientPublicAPIRequest1 = (path, method = "GET", headers = {}) => {
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
        const user = this.userProfile;
        const userToken = await this.getAccessToken();
        const response = await this._clientPublicAPIRequest(URL, "GET", null, undefined, {
            AgentNPN: agentNPN || user?.profile.npn,
            Authorization: `Bearer ${userToken.access_token}`,
        });
        return response.blob();
    };
}
