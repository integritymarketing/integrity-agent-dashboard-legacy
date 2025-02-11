import { ClientsService } from "./clientsService";
import useClientServiceWithToken from "auth/useClientServiceWithToken";

export const LEADS_API_VERSION = "v1.0";

class FinalExpenseService extends ClientsService {
    createFinalExpense = async (data) => {
        try {
            const response = await this._clientAPIRequest(
                `${import.meta.env.VITE_QUOTE_URL}/api/${LEADS_API_VERSION}/FinalExpenses/Create`,
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
            `${import.meta.env.VITE_QUOTE_URL}/api/${LEADS_API_VERSION}/FinalExpenses/Update`,
            "POST",
            data
        );
        if (response.ok) {
            return response?.json();
        }
        throw new Error("Update failed.");
    };

    getFinalExpense = async (id) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_QUOTE_URL}/api/${LEADS_API_VERSION}/FinalExpenses/lead/${id}`,
            "Get"
        );
        if (response.ok) {
            return response?.json();
        }
        throw new Error("Fetch failed.");
    };
}

export const useFinalExpenseService = () => {
    return useClientServiceWithToken(FinalExpenseService);
};

export default new FinalExpenseService();
