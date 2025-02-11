import useFetch from "hooks/useFetch";
import { formatServerDate, parseDate } from "utils/dates";

const flattenMBI = (mbi) => {
    if (!mbi) {
        return null;
    }
    return mbi.replace(/-/g, "");
};

const useAddNewContact = () => {
    const url = `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Leads`;
    const { Post, loading, error } = useFetch(url);

    const addNewContact = async (contact) => {
        const {
            firstName,
            lastName,
            middleName,
            birthdate,
            prefix,
            suffix,
            maritalStatus,
            email,
            phones,
            address,
            primaryCommunication,
            contactRecordType,
            medicareBeneficiaryID,
            partA,
            partB,
            hasMedicAid,
            subsidyLevel,
        } = contact;

        let requestData = {
            leadsId: 0,
            firstName,
            lastName,
            middleName: middleName?.toUpperCase(),
            birthdate: birthdate ? formatServerDate(parseDate(birthdate)) : null,
            prefix,
            suffix,
            maritalStatus,
            leadStatusId: 0,
            contactRecordType,
            medicareBeneficiaryID: medicareBeneficiaryID ? flattenMBI(medicareBeneficiaryID) : undefined,
            partA: partA ? formatServerDate(partA) : null,
            partB: partB ? formatServerDate(partB) : null,
            hasMedicAid,
        };

        requestData.primaryCommunication = primaryCommunication || (email ? "email" : "phone");
        if (subsidyLevel) {
            requestData.subsidyLevel = subsidyLevel;
        }

        if (email) {
            requestData.emails = [
                {
                    emailID: 0,
                    leadEmail: email,
                },
            ];
        }

        if (phones?.leadPhone) {
            requestData.phones = [
                {
                    phoneId: 0,
                    ...phones,
                    leadPhone: `${phones.leadPhone}`.replace(/\D/g, ""),
                },
            ];
        }

        if (address && Object.keys(address).length > 0) {
            const filteredAddress = {
                leadAddressId: 0,
                ...address,
            };

            if (Object.keys(filteredAddress).length > 1) {
                requestData.addresses = [filteredAddress];
            }
        }

        if (requestData.addresses) {
            requestData.addresses = requestData.addresses.filter(
                (addr) => Object.keys(addr).filter((k) => `${addr[k]}`.trim().length > 0).length > 1,
            );

            if (requestData.addresses.length === 0) {
                delete requestData.addresses;
            }
        }

        const cleanEmptyProperties = (obj) => {
            for (const key in obj) {
                if (
                    obj[key] === null ||
                    obj[key] === undefined ||
                    obj[key] === "" ||
                    (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
                ) {
                    delete obj[key];
                } else if (typeof obj[key] === "object") {
                    cleanEmptyProperties(obj[key]);
                }
            }
            return obj;
        };

        requestData = cleanEmptyProperties({
            ...requestData,
            leadStatusId: requestData.leadStatusId || null,
            leadsId: requestData.leadsId || null,
        });

        try {
            return await Post(requestData);
        } catch (err) {
            console.error("Error adding new contact:", err);
            throw err;
        }
    };

    return { addNewContact, loading, error };
};

export default useAddNewContact;
