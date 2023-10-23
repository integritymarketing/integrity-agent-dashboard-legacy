import { ClientsService } from "./clientsService";

export const LEADS_API_VERSION = "v1.0";

class FinalExpenseService extends ClientsService {
  getLeadDetails = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_LEADS_URL}/api/v2.0/Leads/${id}`,
      "Get"
    );
    if (response.ok) {
      return response;
    }
    throw new Error("Fetch failed.");
  };

  createFinalExpense = async (data) => {
    try {
      const response = await this._clientAPIRequest(
        `${process.env.REACT_APP_QUOTE_URL}/api/${LEADS_API_VERSION}/FinalExpenses/Create`,
        "POST",
        data
      );
      if (response.ok) {
        return response.json();
      }
    } catch (err) {
      throw new Error("Update failed.");
    }
  };

  updateFinalExpense = async (data) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${LEADS_API_VERSION}/FinalExpenses/Update`,
      "POST",
      data
    );
    if (response.ok) {
      return response;
    }
    throw new Error("Update failed.");
  };

  getFinalExpense = async (id) => {
    const response = await this._clientAPIRequest(
      `${process.env.REACT_APP_QUOTE_URL}/api/${LEADS_API_VERSION}/FinalExpenses/lead/${id}`,
      "Get"
    );
    if (response.ok) {
      return response;
    }
    throw new Error("Fetch failed.");
  };
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new FinalExpenseService();
