export const LEADS_API_VERSION = "v2.0";

export class CallRecordingsService {
    constructor(getAccessToken) {
        this.getAccessToken = getAccessToken;
    }

    getAllCallRecordingsByAgent = async (isLinkToContact = false) => {
        const baseUrl = `${process.env.REACT_APP_COMMUNICATION_API}/Call/Records?UnAssistedCallRecordingsOnly=true`;
        const url = isLinkToContact ? `${baseUrl}&Sort=callStartTime:desc` : `${baseUrl}&CallStatus=in-progress`;

        const response = await this._clientAPIRequest(url);
        const data = await response.json();
        return data;
    };

    outboundCallFromMedicareCenter = async (data) => {
        const response = await this._clientAPIRequest(
            `${process.env.REACT_APP_COMMUNICATION_API}/Call/CallCustomer`,
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
            `${process.env.REACT_APP_COMMUNICATION_API}/Call/Records/AssignToLead`,
            "PUT",
            data
        );

        if (response.ok) {
            return response;
        }
        throw new Error(response?.statusText);
    };

    assignsLeadToOutboundSmsRecord = async (data) => {
        const response = await this._clientAPIRequest(
            `${process.env.REACT_APP_COMMUNICATION_API}/SmsLog/Records/AssignToLead`,
            "PUT",
            data
        );

        if (response.ok) {
            return response;
        }
        throw new Error(response?.statusText);
    };

    _clientAPIRequest = async (url, method = "GET", body) => {
        const accessToken = await this.getAccessToken();
        const opts = {
            method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        };

        if (body) {
            opts.body = JSON.stringify(body);
        }

        return fetch(url.toString(), opts);
    };
}
