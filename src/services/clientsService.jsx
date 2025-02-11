import moment from "moment";

import { formatServerDate, parseDate } from "utils/dates";

export const LEADS_API_VERSION = "v2.0";
export const LEADS_ONLY_API_VERSION = "v3.0";
export const LEADS_STATUS_API_VERSION = "v3.0";
export const QUOTES_API_VERSION = "v1.0";
export const AGENTS_API_VERSION = "v1.0";
const rangeDateFormat = "yyyyMMDD";

function getRemindersKeys(selectedIsOption, selectedFilterOption) {
    switch (selectedFilterOption) {
        case "active_reminder":
            return selectedIsOption === "is_not"
                ? { hasReminder: true, hasOverDueReminder: true }
                : { hasReminder: true, hasOverDueReminder: null };
        case "overdue_reminder":
            return selectedIsOption === "is_not"
                ? { hasReminder: true, hasOverdueReminder: false }
                : { hasReminder: true, hasOverdueReminder: true };
        case "no_reminders_added":
            return selectedIsOption === "is_not"
                ? { hasReminder: true, hasOverdueReminder: null }
                : { hasReminder: false, hasOverdueReminder: false };
        case "ask_integrity_active":
            return selectedIsOption === "is_not"
                ? { hasAskIntegrityReminder: false }
                : { hasAskIntegrityReminder: true };
        case "ask_integrity_overdue":
            return selectedIsOption === "is_not"
                ? { hasOverdueAskIntegrityReminder: false }
                : { hasOverdueAskIntegrityReminder: true };
        default:
            return {};
    }
}

const getSortByRangeDates = (type) => {
    if (type === "current-year-to-date") {
        return [moment().startOf("year").format(rangeDateFormat), moment().format(rangeDateFormat)];
    } else if (type === "last-week") {
        return [
            moment().subtract(1, "week").startOf("isoWeek").format(rangeDateFormat),
            moment().subtract(1, "week").endOf("isoWeek").format(rangeDateFormat),
        ];
    } else if (type === "last-month") {
        return [
            moment().subtract(1, "month").startOf("month").format(rangeDateFormat),
            moment().subtract(1, "month").endOf("month").format(rangeDateFormat),
        ];
    } else if (type === "last-quarter") {
        return [
            moment().subtract(1, "Q").startOf("Q").format(rangeDateFormat),
            moment().subtract(1, "Q").endOf("Q").format(rangeDateFormat),
        ];
    }
    return [moment().startOf("year").format(rangeDateFormat), moment().format(rangeDateFormat)];
};

const flattenMBI = (mbi) => {
    if (!mbi) {
        return null;
    }
    return mbi.replace(/-/g, "");
};

export class ClientsService {
    constructor(getAccessToken) {
        this.getAccessToken = getAccessToken;
    }
    _clientAPIRequest = async (path, method = "GET", body) => {
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

        return fetch(path, opts);
    };

    _clientPublicAPIRequest = (path, method = "GET", body) => {
        const opts = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };
        if (body) {
            opts.body = JSON.stringify(body);
        }
        return fetch(path, opts);
    };

    getContactListPost = async (
        page,
        pageSize,
        sort,
        searchText,
        leadIds,
        contactRecordType = "",
        stages = [],
        hasReminder = false,
        hasOverdueReminder = false,
        tags = [],
        returnAll,
        selectedFilterSections,
        filterSectionsConfig
    ) => {
        selectedFilterSections = selectedFilterSections.filter((item) => item.selectedFilterOption);
        let remindersKeys = {};
        const reminderSection = selectedFilterSections?.find((item) => item.sectionId === "reminders");
        if (reminderSection) {
            remindersKeys = getRemindersKeys(reminderSection.selectedIsOption, reminderSection.selectedFilterOption);
        }
        const stageSections = selectedFilterSections?.filter((item) => item.sectionId === "stage");
        let stageArray = [];
        if (stageSections.length) {
            stageSections.forEach((stage) => {
                if (stage.selectedIsOption === "is_not") {
                    if (stageArray.length) {
                        const restOfStageIds = stageArray.filter((item) => item !== stage.selectedFilterOption);
                        stageArray = restOfStageIds;
                    } else {
                        const restOfStageIds = filterSectionsConfig.stage.options
                            .filter((item) => item.value !== stage.selectedFilterOption)
                            .map((item) => item.value);
                        stageArray = restOfStageIds;
                    }
                } else {
                    if (!stageArray.includes(stage.selectedFilterOption)) {
                        stageArray.push(stage.selectedFilterOption);
                    }
                }
            });
        }

        const filterTagV3Request = [];
        const tagsSections = selectedFilterSections?.filter(
            (item) => item.sectionId !== "stage" && item.sectionId !== "reminders"
        );
        if (tagsSections.length) {
            tagsSections.forEach((tagSection) => {
                const tagSectionIndex = selectedFilterSections.findIndex((item) => item.id === tagSection.id);
                const previousSection = tagSectionIndex === 0 ? null : selectedFilterSections[tagSectionIndex - 1];
                const andOrValue = previousSection?.nextAndOrOption === "or" ? "OR" : "AND";
                const selectedIsOption = tagSection.selectedIsOption === "is_not" ? "ISNOT" : "IS";
                filterTagV3Request.push({
                    logicalOperator: andOrValue,
                    tagId: tagSection.selectedFilterOption,
                    condition: selectedIsOption,
                });
            });
        }

        const body = {
            pageSize,
            currentPage: page,
            sort: sort,
            stage: stageArray.length ? stageArray : null,
            tags: null,
            search: searchText,
            includeContactPreference: true,
            includeReminder: true,
            includeTags: true,
            includeAddress: true,
            ...remindersKeys,
            returnAll: returnAll,
            filterTagV3Request,
        };

        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_ONLY_API_VERSION}/Leads/GetLeads`,
            "POST",
            body
        );
        if (response?.status >= 400) {
            throw new Error("Leads request failed.");
        }
        const list = await response?.json();

        return list;
    };

    getCampaignLeads = async (
        sort,
        searchText,
        returnAll,
        selectedFilterSections = [],
        campaignId,
        filterId,
        statusOptionsMap,
        actionOrderedId = 0
    ) => {
        if (!campaignId) {
            return;
        }

        selectedFilterSections = selectedFilterSections?.filter((item) => item.selectedFilterOption);

        let remindersKeys = {};
        const reminderSection = selectedFilterSections?.find((item) => item.sectionId === "reminders");
        if (reminderSection) {
            remindersKeys = getRemindersKeys(reminderSection.selectedIsOption, reminderSection.selectedFilterOption);
        }
        const stageSections = selectedFilterSections?.filter((item) => item.sectionId === "stage");
        let stageArray = [];
        if (stageSections?.length) {
            stageSections?.forEach((stage) => {
                if (stage?.selectedIsOption === "is_not") {
                    if (stageArray?.length) {
                        const restOfStageIds = stageArray?.filter((item) => item !== stage.selectedFilterOption);
                        stageArray = restOfStageIds;
                    } else {
                        const restOfStageIds = statusOptionsMap
                            .filter((item) => item.value !== stage.selectedFilterOption)
                            .map((item) => item.value);
                        stageArray = restOfStageIds;
                    }
                } else {
                    if (!stageArray?.includes(stage.selectedFilterOption)) {
                        stageArray?.push(stage.selectedFilterOption);
                    }
                }
            });
        }

        const filterTagV3Request = [];
        const tagsSections = selectedFilterSections?.filter(
            (item) => item.sectionId !== "stage" && item.sectionId !== "reminders"
        );
        if (tagsSections?.length) {
            tagsSections?.forEach((tagSection) => {
                const tagSectionIndex = selectedFilterSections?.findIndex((item) => item.id === tagSection.id);
                const previousSection = tagSectionIndex === 0 ? null : selectedFilterSections[tagSectionIndex - 1];
                const andOrValue = previousSection?.nextAndOrOption === "or" ? "OR" : "AND";
                const selectedIsOption = tagSection.selectedIsOption === "is_not" ? "ISNOT" : "IS";
                filterTagV3Request.push({
                    logicalOperator: andOrValue,
                    tagId: tagSection.selectedFilterOption,
                    condition: selectedIsOption,
                });
            });
        }

        const body = {
            pageSize: 12,
            currentPage: 1,
            filterId: filterId,
            sort: sort,
            search: searchText,
            stage: stageArray.length ? stageArray : null,
            tags: null,
            includeReminder: true,
            includeTags: true,
            includeContactPreference: true,
            ...remindersKeys,
            returnAll: returnAll,
            filterTagV3Request,
        };

        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Campaign/GetCampaignLeads/${campaignId}/${actionOrderedId}`,
            "POST",
            body
        );
        if (response?.status >= 400) {
            throw new Error("Leads request failed.");
        }
        const list = await response?.json();

        return list;
    };

    getList = async (
        page,
        pageSize,
        sort,
        searchText,
        leadIds,
        contactRecordType = "",
        stages = [],
        hasReminder = false,
        hasOverdueReminder = false,
        tags = [],
        returnAll,
        IncludePolicyCounts = true,
        IncludeAddress = true,
        IncludeReminder = true,
        IncludeTags = true,
        IncludeContactPreference = true
    ) => {
        const params = {
            ReturnAll: returnAll,
            PageSize: pageSize,
            CurrentPage: page,
            Search: searchText,
            leadIds,
            IncludeReminder: IncludeReminder,
            IncludePolicyCounts: IncludePolicyCounts,
            IncludeAddress: IncludeAddress,
            IncludeTags: IncludeTags,
            IncludeContactPreference: IncludeContactPreference,
        };
        if (hasReminder) {
            params.HasReminder = hasReminder;
        }
        if (hasOverdueReminder) {
            params.HasOverdueReminder = hasOverdueReminder;
        }
        if (contactRecordType !== "") {
            params.ContactRecordType = contactRecordType;
        }
        if (stages && stages.length > 0) {
            params.Stage = stages;
        }
        if (tags && tags.length > 0) {
            params.Tags = tags;
        }

        if (sort && sort.length > 0) {
            params.Sort = sort;
        }

        const queryStr = Object.keys(params)
            .map((key) => {
                if (key === "leadIds" && leadIds) {
                    return (params[key] || []).map((leadId) => `${key}=${leadId}`).join("&");
                }
                if (key === "Stage") {
                    return stages.map((stageId) => `${key}=${stageId}`).join("&");
                }
                if (key === "Tags") {
                    return tags.map((tagId) => `${key}=${tagId}`).join("&");
                }
                if (key === "Sort") {
                    return sort.map((sortId) => `${key}=${sortId}`).join("&");
                }
                return params[key] ? `${key}=${params[key]}` : null;
            })
            .filter((str) => str !== null)
            .join("&");
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_ONLY_API_VERSION}/Leads?${queryStr}`
        );
        if (response?.status >= 400) {
            throw new Error("Leads request failed.");
        }
        const list = await response?.json();

        return list;
    };

    newClientObj = () => {
        return {
            leadsId: null,
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            postalCode: "",
            notes: "",
            followUpDate: "",
            product: "",
            leadStatusId: 1,
            statusName: "New",
        };
    };

    getClient = async (id) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${id}`
        );

        return response;
    };

    _getFormattedPhone = (phone) => (phone ? `${phone}`.replace(/\D/g, "") : null);

    _getFormattedData = ({ phone, followUpDate, email, leadStatusId, ...data }, baseValues = {}) => {
        return {
            ...baseValues,
            ...data,
            email: email || null,
            phone: this._getFormattedPhone(phone),
            followUpDate: followUpDate ? formatServerDate(parseDate(followUpDate)) : null,
            leadStatusId: parseInt(leadStatusId, 10),
        };
    };

    createClient = async (data) => {
        const reqData = this._getFormattedData(data);
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads`,
            "POST",
            reqData
        );

        return response;
    };

    bulkCreateClients = async (reqData) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/batch`,
            "POST",
            reqData
        );

        return response;
    };

    bulkExportContacts = async (reqData) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/bulkexport`,
            "POST",
            reqData
        );

        if (response?.ok) {
            return response;
        }
        throw new Error("Update failed.");
    };

    updateClient = async (oldValues, data) => {
        const reqData = this._getFormattedData(data, oldValues);
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${oldValues.leadsId}`,
            "PUT",
            reqData
        );
        if (response?.ok) {
            return response;
        }
        throw new Error("Update failed.");
    };

    reActivateClients = async (data) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/reactivate`,
            "PUT",
            data
        );

        return response;
    };

    getStatuses = async () => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_STATUS_API_VERSION}/Leads/statuses`
        );

        return response?.json();
    };

    getContactInfo = async (id) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${id}`
        );

        return response?.json();
    };

    deleteContactLeads = async (leadsId) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads`,
            "DELETE",
            leadsId
        );

        return response;
    };

    createReminder = async (data) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Reminders`,
            "POST",
            data
        );

        return response?.json();
    };

    updateReminder = async (data) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Reminders/${data.leadId}`,
            "PUT",
            data
        );

        return response?.json();
    };

    deleteReminder = async (id) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Reminders/${id}`,
            "DELETE"
        );

        return response;
    };

    createActivity = async (data) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Activities`,
            "POST",
            data
        );

        return response?.json();
    };

    updateActivity = async (data, id) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Activities/${id}`,
            "PUT",
            data
        );

        return response?.json();
    };

    deleteActivity = async (id) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Activities/${id}`,
            "DELETE"
        );

        return response;
    };

    deleteClient = async (id) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${id}`,
            "DELETE"
        );

        return response;
    };

    updateLead = async (contact) => {
        const {
            firstName,
            middleName,
            lastName,
            birthdate,
            email,
            phones,
            address,
            primaryCommunication,
            contactRecordType,
            leadsId,
            leadStatusId,
            emailID,
            phoneId,
            leadAddressId,
            notes,
            medicareBeneficiaryID,
            partA,
            partB,
        } = contact;
        const reqData = {
            leadsId,
            firstName,
            middleName: middleName?.toUpperCase(),
            lastName,
            birthdate: birthdate ? formatServerDate(parseDate(birthdate)) : null,
            leadStatusId,
            primaryCommunication,
            contactRecordType,
            notes,
        };
        if (medicareBeneficiaryID) {
            reqData.medicareBeneficiaryID = flattenMBI(medicareBeneficiaryID);
        }
        if (partA) {
            reqData.partA = formatServerDate(partA);
        }
        if (partB) {
            reqData.partB = formatServerDate(partB);
        }
        reqData.emails = [];
        if (email !== null && email !== undefined) {
            reqData.emails = [
                {
                    emailID: emailID,
                    leadEmail: email,
                },
            ];
        }

        if (phones && phones.leadPhone) {
            reqData.phones = [
                {
                    phoneId: phoneId,
                    ...phones,
                    leadPhone: this._getFormattedPhone(phones.leadPhone),
                },
            ];
        }

        reqData.addresses = [
            {
                leadAddressId: leadAddressId,
                ...address,
            },
        ];

        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${reqData.leadsId}`,
            "PUT",
            reqData
        );

        return response;
    };

    getDuplicateContact = async (contact) => {
        const { firstName, lastName, email, phones, leadId = 0 } = contact;
        const reqData = {
            firstName,
            lastName,
            leadId,
        };
        // don't attempt call if either are empty
        // as it will throw a 400 and fill up the logs.
        if (!email && !phones?.leadPhone) {
            return {};
        }

        if (email) {
            reqData.emails = [
                {
                    leadEmail: email,
                },
            ];
        }
        if (phones?.leadPhone) {
            reqData.phones = [
                {
                    ...phones,
                    leadPhone: this._getFormattedPhone(phones.leadPhone),
                },
            ];
        }

        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/GetDuplicateContact`,
            "POST",
            reqData
        );
        return response;
    };

    addNewContact = async (contact) => {
        const {
            firstName,
            lastName,
            middleName,
            birthdate,
            email,
            phones,
            address,
            primaryCommunication,
            contactRecordType,
            medicareBeneficiaryID,
            partA,
            partB,
        } = contact;

        let requestData = {
            leadsId: 0,
            firstName,
            lastName,
            middleName: middleName?.toUpperCase(),
            birthdate: birthdate ? formatServerDate(parseDate(birthdate)) : null,
            leadStatusId: 0,
            contactRecordType,
            medicareBeneficiaryID: medicareBeneficiaryID ? flattenMBI(medicareBeneficiaryID) : undefined,
            partA: partA ? formatServerDate(partA) : null,
            partB: partB ? formatServerDate(partB) : null,
        };

        requestData.primaryCommunication = primaryCommunication || (email ? "email" : "phone");

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
                    leadPhone: this._getFormattedPhone(phones.leadPhone),
                },
            ];
        }

        if (address && Object.keys(address).length > 0) {
            const filteredAddress = {
                leadAddressId: 0,
                ...address,
            };

            // Only include address if there are other properties besides leadAddressId
            if (Object.keys(filteredAddress).length > 1) {
                requestData.addresses = [filteredAddress];
            }
        }

        if (requestData.addresses) {
            requestData.addresses = requestData.addresses.filter(
                (addr) =>
                    Object.keys(addr).filter((k) => {
                        return `${addr[k]}`.trim().length > 0;
                    }).length > 1
            );
            if (requestData.addresses.length === 0) {
                delete requestData.addresses;
            }
        }

        // Recursive function to remove empty or "falsy" properties
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

        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads`,
            "POST",
            requestData
        );

        return response;
    };

    getContactPreferences = async (id) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/ContactPreferences/${id}`,
            "GET"
        );

        return response?.json();
    };

    createContactPreferences = async (leadsId, payload) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/ContactPreferences`,
            "POST",
            { leadsId, ...payload }
        );

        if (response?.ok) {
            return response;
        }
        throw new Error("Update failed.");
    };

    updateContactPreferences = async (id, payload) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/ContactPreferences/${id}`,
            "PUT",
            payload
        );

        if (response?.ok) {
            return response?.json();
        }
        throw new Error("Update failed.");
    };

    getCounties = async (zipcode) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_QUOTE_URL}/api/v1.0/Search/GetCounties?zipcode=${zipcode}`,
            "GET"
        );

        return response?.json();
    };

    getLeadPharmacies = async (leadId) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Pharmacies`,
            "GET"
        );

        return response?.json().then((res) => res || []);
    };

    /*getLeadProviders = async (leadId) => {  // TODO: Is this being used?
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Provider`,
            "GET"
        );

        return response?.json().then((res) => res || []);
    };*/

    getLeadPrescriptions = async (leadId) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions`,
            "GET"
        );
        return response?.json().then((res) => res || []);
    };

    createPrescription = async (leadId, reqData, consumerId) => {
        let buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions`;
        if (consumerId) {
            buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions/syncid/${consumerId}`;
        }
        const response = await this._clientAPIRequest(`${buildUrl}`, "POST", reqData);
        if (response?.ok) {
            return response;
        }
        throw new Error("Update failed.");
    };

    editPrescription = async (leadId, reqData, consumerId) => {
        let buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions/${reqData.dosageRecordID}`;
        if (consumerId) {
            buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions/${reqData.dosageRecordID}/syncid/${consumerId}`;
        }
        const response = await this._clientAPIRequest(`${buildUrl}`, "POST", reqData);

        if (response?.ok) {
            return response?.json();
        }
        throw new Error("Update failed.");
    };

    deletePrescription = async (leadId, id, consumerId) => {
        let buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions/${id}`;
        if (consumerId) {
            buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Prescriptions/${id}/${consumerId}`;
        }
        const response = await this._clientAPIRequest(`${buildUrl}`, "DELETE");

        return response;
    };

    getDrugNames = async (drugName) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Search/DrugName?drugName=${drugName}`,
            "GET"
        );
        return response?.json();
    };

    getDrugDetails = async (drugID) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Search/DrugDetail?id=${drugID}`,
            "GET"
        );
        return response?.json();
    };

    deleteHealthCondition = async (contactId, conditionId) => {
        const buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/HealthCondition/Lead/${contactId}/id/${conditionId}`;
        const response = await this._clientAPIRequest(`${buildUrl}`, "DELETE");
        return response;
    };

    deletePharmacy = async (leadId, id, consumerId) => {
        let buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Pharmacies/${id}`;
        if (consumerId) {
            buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Pharmacies/${id}/${consumerId}`;
        }
        const response = await this._clientAPIRequest(`${buildUrl}`, "DELETE");

        return response;
    };

    createPharmacy = async (leadId, reqData, consumerId) => {
        let buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Pharmacies`;
        if (consumerId) {
            buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Pharmacies/${consumerId}`;
        }
        const response = await this._clientAPIRequest(`${buildUrl}`, "POST", reqData);
        if (response?.ok) {
            return response;
        }
        throw new Error("Update failed.");
    };

    getLeadProviders = async (leadId) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Provider/ProviderSearchLookup`,
            "GET"
        );

        return response?.json();
    };

    createLeadProvider = async (leadId, data, consumerId) => {
        let buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Provider`;
        if (consumerId) {
            buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Provider/${consumerId}`;
        }
        const response = await this._clientAPIRequest(`${buildUrl}`, "POST", data);

        if (response?.ok) {
            return response;
        }
        throw new Error("Create Lead failed.");
    };

    deleteProvider = async (payload, leadId, consumerId) => {
        let buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Provider`;
        if (consumerId) {
            buildUrl = `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}/Provider/${consumerId}`;
        }
        const response = await this._clientAPIRequest(`${buildUrl}`, "DELETE", payload);
        if (response?.ok) {
            return response;
        }
        throw new Error("Delete Lead failed.");
    };

    searchProviders = async (query) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Search/Providers?${query}`,
            "GET"
        );

        return response?.json();
    };

    searchPharmacies = async (payload, isOnline = false) => {
        if (isOnline) {
            const response = await this._clientAPIRequest(
                `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Search/DigitalPharmacies`,
                "GET"
            );

            return response?.json();
        } else {
            const response = await this._clientAPIRequest(
                `${import.meta.env.VITE_QUOTE_URL}/api/${QUOTES_API_VERSION}/Search/Pharmacies`,
                "POST",
                payload
            );

            return response?.json();
        }
    };

    getLatlongByAddress = async (zipcode, address) => {
        const opts = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${address} ${zipcode}.json?limit=1&types=address&access_token=${import.meta.env.VITE_MAPBOX_GEO_TOKEN}
        `,
            opts
        );

        return response?.json();
    };

    sendSoaInformation = async (payload, leadsId) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v2.0/lead/${leadsId}/Soa`,
            "POST",
            payload
        );

        if (response?.ok) {
            return response;
        }
        throw new Error("Failed to send soa information.");
    };

    getSoaListByLeadId = async (leadsId) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v2.0/lead/${leadsId}/Soa`,
            "GET"
        );
        if (response?.ok) {
            return response?.json();
        }
        throw new Error("Failed to Get soa list by lead Id.");
    };

    getSoaByLinkCode = async (leadsId, linkCode) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v2.0/lead/${leadsId}/Soa/${linkCode}`,
            "GET"
        );

        return response?.json();
    };

    getSoaStatusByLinkCode = async (linkCode) => {
        const response = await this._clientPublicAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Soa/${linkCode}`,
            "GET"
        );

        return response?.json();
    };

    saveSoaInformationForLeadByLinkCode = async (payload, linkCode) => {
        const response = await this._clientPublicAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Soa/${linkCode}`,
            "POST",
            payload
        );

        if (response?.ok) {
            return response;
        }
        throw new Error("Failed to send soa information.");
    };
    saveSOAInformation = async (linkCode, payload) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Soa/${linkCode}`,
            "POST",
            payload
        );

        if (response?.ok) {
            return response;
        }
    };

    /*Start Dashboard API */

    getDashboardData = async (
        sort,
        currentPage,
        pageSize,
        activitySubjects = [],
        ReturnAll,
        searchText,
        leadIds,
        contactRecordType = "",
        stages = [],
        hasReminder = false,
        DateRangeFilterType,
        LeadSource = ""
    ) => {
        const params = {
            ReturnAll,
            CurrentPage: currentPage,
            PageSize: pageSize,
            Sort: sort,
            Search: searchText,
            leadIds,
            LeadSource,
            IncludeActivity: true,
            IncludeContactPreference: true,
        };

        if (typeof DateRangeFilterType === "number") {
            params.DateRangeFilterType = DateRangeFilterType;
        }

        if (activitySubjects && activitySubjects?.length > 0) {
            params.ActivitySubject = activitySubjects;
        }
        if (hasReminder) {
            params.HasReminder = hasReminder;
        }
        if (contactRecordType !== "") {
            params.ContactRecordType = contactRecordType;
        }
        if (stages && stages?.length > 0) {
            params.Stage = stages;
        }

        const queryStr = Object.keys(params)
            .map((key) => {
                if (key === "leadIds" && leadIds) {
                    return (params[key] || []).map((leadId) => `${key}=${leadId}`).join("&");
                }
                if (key === "Stage") {
                    return stages.map((stageId) => `${key}=${stageId}`).join("&");
                }
                if (key === "DateRangeFilterType") {
                    return `${key}=${DateRangeFilterType}`;
                }
                if (key === "ActivitySubject") {
                    return activitySubjects
                        .map((activitySubject) => `LatestActivitySubject=${activitySubject}`)
                        .join("&");
                }
                return params[key] ? `${key}=${params[key]}` : null;
            })
            .filter((str) => str !== null)
            .join("&");
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_ONLY_API_VERSION}/Leads?${queryStr}`
        );
        if (response?.status >= 400) {
            throw new Error("Leads request failed.");
        }
        const list = await response?.json();

        return list;
    };

    getDashbaordSummary = async () => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_STATUS_API_VERSION}/Leads/summary`,
            "GET"
        );

        return response?.json();
    };

    getApplicationCount = async (sortByRange) => {
        const [startDate, endDate] = getSortByRangeDates(sortByRange);
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/appCount?startdate=${startDate}&enddate=${endDate}`,
            "GET"
        );

        return response?.json();
    };

    getAgents = async (npn) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/Agents/rts/${npn}`,
            "GET"
        );

        if (!response?.ok) {
            throw new Error(response?.statusText);
        }

        return response?.json();
    };

    /*End Dashboard API */

    /*Start purl API calls */

    getAgentPurlCodeByNPN = async (agentnpn) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/Purl/npn/${agentnpn}`,
            "GET"
        );
        return response?.json();
    };

    createAgentPurlCode = async (payload) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/Purl`,
            "POST",
            payload
        );
        if (response?.ok) {
            return response?.json();
        }
    };

    updateAgentAvailability = async (payload) => {
        const url = `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentMobile/Availability`;
        const response = await this._clientAPIRequest(url, "POST", payload);
        if (response?.ok) {
            return response;
        }
    };

    updateAgentPreferences = async (payload) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentMobile/Preference`,
            "POST",
            payload
        );
        if (response?.ok) {
            return response?.json();
        }
    };

    getAgentAvailability = async (id) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentMobile/Available/${id}`,
            "GET"
        );
        if (response?.ok) {
            return response?.json();
        }
    };

    updateAgentCallForwardingNumber = async (payload) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/AgentMobile/CallForwardNumber`,
            "POST",
            payload
        );
        if (response?.ok) {
            return response;
        }
    };
    /*End purl API calls */

    getAgentByAgentId = async (id) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/Agents/${id}`,
            "GET"
        );
        const agentData = await response?.json();
        if (!agentData?.virtualPhoneNumber) {
            await this.generateAgentTwiloNumber(id);
        }
        return agentData;
    };

    generateAgentTwiloNumber = async (id) => {
        await this._clientAPIRequest(
            `${import.meta.env.VITE_AGENTS_URL}/api/${AGENTS_API_VERSION}/Call/GenerateVirtualPhoneNumber/${id}?limit=1`,
            "POST"
        );
    };

    getAllTagsByGroups = async () => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Tag/TagsGroupByCategory?mappedLeadTagsOnly=true`,
            "GET"
        );
        return response?.json();
    };

    getTagsGroupByCategory = async () => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Tag/TagsGroupByCategory`,
            "GET"
        );
        return response?.json();
    };

    updateLeadsTags = async (leadId, tagIds = []) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/LeadTags/Update`,
            "POST",
            { leadId, tagIds }
        );
        return response?.json();
    };

    updateLeadPhone = async (contact, leadPhone) => {
        const requestData = {
            leadsId: contact.leadsId,
            firstName: contact.firstName,
            lastName: contact.lastName,
            birthdate: contact.birthdate,
            leadStatusId: contact.leadStatusId,
            primaryCommunication: contact.primaryCommunication,
            contactRecordType: contact.contactRecordType,
            notes: contact.notes,
            emails: contact.emails,
            phones: [
                {
                    phoneId: 0,
                    leadPhone: leadPhone?.replace("+1", ""),
                    phoneLabel: "mobile",
                },
            ],
            addresses: contact.addresses,
        };
        if (contact.medicareBeneficiaryID) {
            requestData.medicareBeneficiaryID = contact.medicareBeneficiaryID;
        }
        if (contact.partA) {
            requestData.partA = contact.partA;
        }
        if (contact.partB) {
            requestData.partB = contact.partB;
        }
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${contact.leadsId}`,
            "PUT",
            requestData
        );
        if (!response?.ok) {
            throw new Error("Cannot update contact");
        }
        return response?.json();
    };

    updateLeadZip = async (contact, zip, county, countyFips) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${contact.leadsId}`,
            "PUT",
            {
                leadsId: contact.leadsId,
                firstName: contact.firstName,
                lastName: contact.lastName,
                birthdate: contact.birthdate,
                leadStatusId: contact.leadStatusId,
                primaryCommunication: contact.primaryCommunication,
                contactRecordType: contact.contactRecordType,
                notes: contact.notes,
                emails: contact.emails,
                phones: contact.phones,
                addresses: [
                    {
                        leadAddressId: contact?.addresses?.[0]?.leadAddressId,
                        address1: contact?.addresses?.[0]?.address1,
                        address2: contact?.addresses?.[0]?.address2,
                        city: contact?.addresses?.[0]?.city,
                        stateCode: contact?.addresses?.[0]?.stateCode,
                        postalCode: zip,
                        county: county,
                        countyFips: countyFips,
                        createDate: contact?.addresses?.[0]?.createDate,
                        modifyDate: contact?.addresses?.[0]?.modifyDate,
                    },
                ],
            }
        );
        if (!response?.ok) {
            throw new Error("Cannot update contact");
        }
        return response?.json();
    };

    updateLeadState = async (contact, stateCode) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${contact.leadsId}`,
            "PUT",
            {
                leadsId: contact.leadsId,
                firstName: contact.firstName,
                lastName: contact.lastName,
                birthdate: contact.birthdate,
                leadStatusId: contact.leadStatusId,
                primaryCommunication: contact.primaryCommunication,
                contactRecordType: contact.contactRecordType,
                notes: contact.notes,
                emails: contact.emails,
                phones: contact.phones,
                addresses: [
                    {
                        leadAddressId: contact?.addresses?.[0]?.leadAddressId,
                        address1: contact?.addresses?.[0]?.address1,
                        address2: contact?.addresses?.[0]?.address2,
                        city: contact?.addresses?.[0]?.city,
                        stateCode: stateCode,
                        postalCode: contact?.addresses?.[0]?.postalCode,
                        county: contact?.addresses?.[0]?.county,
                        countyFips: contact?.addresses?.[0]?.countyFips,
                        createDate: contact?.addresses?.[0]?.createDate,
                        modifyDate: contact?.addresses?.[0]?.modifyDate,
                    },
                ],
            }
        );
        if (!response?.ok) {
            throw new Error("Cannot update contact");
        }
        return response?.json();
    };

    updateLeadCounty = async (contact, county, fips, zip, state) => {
        let addresses = [];
        if (contact.addresses.length !== 0 && contact.addresses?.[0].leadAddressId) {
            addresses = [
                {
                    leadAddressId: contact.addresses?.[0].leadAddressId,
                    address1: contact.addresses?.[0].address1,
                    address2: contact.addresses?.[0].address2,
                    city: contact.addresses?.[0].city,
                    stateCode: state ? state : contact.addresses?.[0].stateCode,
                    postalCode: zip ? zip : contact.addresses?.[0].postalCode,
                    county: county,
                    countyFips: fips,
                    createDate: contact.addresses?.[0].createDate,
                    modifyDate: contact.addresses?.[0].modifyDate,
                },
            ];
        } else {
            addresses = [
                {
                    leadAddressId: null,
                    address1: null,
                    address2: null,
                    city: null,
                    stateCode: state ? state : contact.addresses?.[0].stateCode,
                    postalCode: zip ? zip : contact.addresses?.[0].postalCode,
                    county: county,
                    countyFips: fips,
                    createDate: null,
                    modifyDate: null,
                },
            ];
        }

        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/${LEADS_API_VERSION}/Leads/${contact.leadsId}`,
            "PUT",
            {
                leadsId: contact.leadsId,
                firstName: contact.firstName,
                lastName: contact.lastName,
                birthdate: contact.birthdate,
                leadStatusId: contact.leadStatusId,
                primaryCommunication: contact.primaryCommunication,
                contactRecordType: contact.contactRecordType,
                notes: contact.notes,
                emails: contact.emails,
                phones: contact.phones,
                medicareBeneficiaryID: contact.medicareBeneficiaryID,
                partA: contact.partA,
                partB: contact.partB,
                addresses: [
                    {
                        leadAddressId: addresses?.[0]?.leadAddressId,
                        address1: addresses?.[0]?.address1,
                        address2: addresses?.[0]?.address2,
                        city: addresses?.[0]?.city,
                        stateCode: addresses?.[0]?.stateCode,
                        postalCode: addresses?.[0]?.postalCode,
                        county: addresses?.[0]?.county,
                        countyFips: addresses?.[0]?.countyFips,
                        createDate: addresses?.[0]?.createDate,
                        modifyDate: addresses?.[0]?.modifyDate,
                    },
                ],
            }
        );
        if (!response?.ok) {
            throw new Error("Cannot update contact");
        }
        return response?.json();
    };

    saveTag = async ({ leadsId, tagCategoryId, tagLabel, tagId }) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Tag/${tagId || ""}`,
            tagId ? "PUT" : "POST",
            {
                tagId: tagId || 0,
                tagLabel,
                tagCategoryId,
                leadsId,
            }
        );
        return response?.json();
    };

    deleteTag = async ({ tagId }) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Tag/${tagId || ""}`,
            "DELETE"
        );
        return response?.ok;
    };

    getTaskList = async (npn, dateRange, status) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Leads/tasks/${npn}/${dateRange}/${status}`,
            "GET"
        );

        return response?.json();
    };

    getTaskListCount = async (npn, dateRange) => {
        const response = await this._clientAPIRequest(
            `${import.meta.env.VITE_LEADS_URL}/api/v3.0/Leads/taskcount/${npn}/${dateRange}`,
            "GET"
        );

        return response?.json();
    };
}

export default new ClientsService();
