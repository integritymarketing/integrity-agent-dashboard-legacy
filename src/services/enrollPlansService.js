export const QUOTES_API_VERSION = "v1.0";
import moment from "moment";

export class EnrollPlansService {
    constructor(getAccessToken) {
        this.getAccessToken = getAccessToken;
    }

    getEnrollPlans = async (leadId) => {
        const url = new URL(`${process.env.REACT_APP_BOOKOFBUSINESS_API}/lead/${leadId}`);

        const response = await this._clientAPIRequest(url, "GET", {
            LeadId: leadId,
        });

        return response?.json();
    };

    getPolicySnapShotList = async (npn, dateRange, status) => {
        const offset = moment().utcOffset();
        const url = new URL(
            `${process.env.REACT_APP_BOOKOFBUSINESS_API}/summary/${npn}/${dateRange}/${status}/${offset}`
        );

        const response = await this._clientAPIRequest(url, "GET");

        return response?.json();
    };

    getPolicySnapShotCount = async (npn, dateRange) => {
        const offset = moment().utcOffset();
        const url = new URL(`${process.env.REACT_APP_BOOKOFBUSINESS_API}/policycount/${npn}/${dateRange}/${offset}`);

        try {
            const response = await this._clientAPIRequest(url, "GET");

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error("Failed to fetch policy snapshot count");
            }
        } catch (error) {
            return error;
        }
    };

    getBookOfBusinessBySourceId = async (npn, id) => {
        const url = new URL(`${process.env.REACT_APP_BOOKOFBUSINESS_API}/${npn}/SourceId/${id}`);

        const response = await this._clientAPIRequest(url, "GET");
        return response?.json();
    };

    updateBookOfBusiness = async (updateBookPayload) => {
        const url = new URL(`${process.env.REACT_APP_BOOKOFBUSINESS_API}`);

        const response = await this._clientAPIRequest(url, "PUT", "", updateBookPayload);
        return response?.json();
    };

    enroll = async (leadId, planId, data) => {
        const response = await this._clientAPIRequest(
            `${process.env.REACT_APP_ENROLLMENT_SERVICE_API}/Medicare/Lead/${leadId}/Enroll/${planId}`,
            "POST",
            "",
            data
        );

        return response?.json();
    };

    enrollConsumer = async (leadId, planId, data, agentNPN) => {
        const response = await this._clientPublicAPIRequest(
            `${process.env.REACT_APP_ENROLLMENT_SERVICE_API}/Medicare/Lead/${leadId}/Enroll/${planId}`,
            "POST",
            data,
            {
                AgentNPN: agentNPN,
            }
        );

        return response?.json();
    };

    sharePolicy = async (sharePolicyPayload) => {
        const url = new URL(`${process.env.REACT_APP_ENROLLMENT_SERVICE_API}/Medicare/ShareCurrentPlanSnapshot`);

        const response = await this._clientAPIRequest(url, "POST", "", sharePolicyPayload);
        return response?.json();
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
        // Convert the URL string to a URL object
        const urlObject = new URL(url);
        urlObject.search = new URLSearchParams(query).toString();

        if (body) {
            opts.body = JSON.stringify(body);
        }

        return fetch(urlObject.toString(), opts);
    };

    _clientPublicAPIRequest = (path, method = "GET", body, headers = {}) => {
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
