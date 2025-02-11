import useFetch from "../useFetch";

const useAssignLead = () => {
    const smsUrl = `${import.meta.env.VITE_CALL_RECORDINGS_URL}/api/v1.0/OutboundSmsRecord`;
    const callUrl = `${import.meta.env.VITE_CALL_RECORDINGS_URL}/api/v1.0/InboundCallRecord`;
    const { Post: postSms, loading: smsLoading, error: smsError } = useFetch(smsUrl);
    const { Post: postCall, loading: callLoading, error: callError } = useFetch(callUrl);

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
