import useFetch from "../useFetch";

const useDuplicateContact = () => {
    const url = `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Leads/GetDuplicateContact`;
    const { Post, loading, error } = useFetch(url);

    const checkDuplicateContact = async (values) => {
        const { firstName, lastName, email, phones } = values;
        const leadPhone = phones?.leadPhone;

        const requestData = {
            firstName,
            lastName,
            leadId: 0,
        };

        if (!email && !leadPhone) {
            return {};
        }

        if (email) {
            requestData.emails = [
                {
                    leadEmail: email,
                },
            ];
        }

        if (leadPhone) {
            requestData.phones = [
                {
                    ...phones,
                    leadPhone: `${leadPhone}`.replace(/\D/g, ""),
                },
            ];
        }

        try {
            return await Post(requestData);
        } catch (err) {
            console.error("Error checking duplicate contact:", err);
            return { isExactDuplicate: false };
        }
    };

    return { checkDuplicateContact, loading, error };
};

export default useDuplicateContact;
