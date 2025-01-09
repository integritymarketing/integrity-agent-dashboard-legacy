import useFetch from "../useFetch";

const useLinkContact = () => {
    const url = `${process.env.REACT_APP_BOOKOFBUSINESS_API}`;
    const { Put, loading, error } = useFetch(url);

    const linkContact = async (leadIdParam, state) => {
        const {
            policyId,
            policyNumber,
            sourceId,
            agentNpn,
            policyStatus,
            firstName: fname,
            lastName: lname,
            linkingType,
        } = state;

        const leadIdString = leadIdParam?.toString();
        const updateBusinessBookPayload = {
            agentNpn,
            leadId: leadIdString,
            policyNumber: policyId || policyNumber,
            consumerFirstName: fname,
            consumerLastName: lname,
            leadDate: new Date(),
            leadStatus: policyStatus,
            linkingType,
            sourceId,
        };

        try {
            const response = await Put(updateBusinessBookPayload);

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage?.message || "Failed to link contact");
            }

            return response;
        } catch (error1) {
            console.error("Error linking contact:", error1);
            throw error1;
        }
    };

    return { linkContact, loading, error };
};

export default useLinkContact;
