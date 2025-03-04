import useFetch from "../useFetch";

const useAssignLead = () => {
    const smsUrl = `${import.meta.env.VITE_COMMUNICATION_API}/SmsLog/Records/AssignToLead`;
    const callUrl = `${import.meta.env.VITE_COMMUNICATION_API}/Call/Records/AssignToLead`;
    const { Put: postSms, loading: smsLoading, error: smsError } = useFetch(smsUrl);
    const { Put: postCall, loading: callLoading, error: callError } = useFetch(callUrl);

    const assignLeadToOutboundSmsRecord = async (payload) => {
        try {
            const response = await postSms(payload);
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage?.message || "Failed to assign lead to SMS record");
            }
            return response;
        } catch (error) {
            console.error("Error assigning lead to SMS record:", error);
            throw error;
        }
    };

    const assignLeadToInboundCallRecord = async (payload) => {
        try {
            const response = await postCall(payload);
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage?.message || "Failed to assign lead to Call record");
            }
            return response;
        } catch (error) {
            console.error("Error assigning lead to Call record:", error);
            throw error;
        }
    };

    return {
        assignLeadToOutboundSmsRecord,
        assignLeadToInboundCallRecord,
        loading: smsLoading || callLoading,
        error: smsError || callError,
    };
};

export default useAssignLead;
