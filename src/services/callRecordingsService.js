import {ClientsService} from "./clientsService";

export const LEADS_API_VERSION = "v2.0";

class CallRecordingsService extends ClientsService {

  getAllCallRecordingsByAgent = async () => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/${LEADS_API_VERSION}/Call/Records?UnAssistedCallRecordingsOnly=true`
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
 
}

export default new CallRecordingsService();



