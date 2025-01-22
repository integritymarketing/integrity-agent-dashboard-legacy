import { createContext, useCallback, useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PropTypes from "prop-types";

import { getFormattedData } from "utilities/formatData";
import performAsyncOperation from "utilities/performAsyncOperation";

import { formatServerDate, parseDate } from "utils/dates";

import useFetch from "hooks/useFetch";
import useToast from "hooks/useToast";
import removeNullAndEmptyFields from "utils/removeNullAndEmptyFields";

const flattenMBI = (mbi) => {
    if (!mbi) {
        return null;
    }
    return mbi.replace(/-/g, "");
};

const getFormattedPhone = (phone) => (phone ? `${phone}`.replace(/\D/g, "") : null);

export const LeadDetailsContext = createContext();

export const LeadDetailsProvider = ({ children }) => {
    const leadsApiUrl = `${import.meta.env.VITE_LEADS_URL}/api/v2.0/Leads`;

    const {
        Get: fetchLeadDetails,
        loading: isLoadingLeadDetails,
        error: leadDetailsError,
        Put: editLeadDetails,
        Delete: deleteContact,
    } = useFetch(leadsApiUrl);

    const showToast = useToast();

    // selectedTab  state can be one of ["overview", "scopeOfAppointment", "policies", "health"]
    const [selectedTab, setSelectedTab] = useState("overview");
    const [leadDetails, setLeadDetails] = useState(null);
    const { leadId: leadIdParam, contactId } = useParams();
    const leadID = leadIdParam || contactId;

    const getLeadDetails = useCallback(
        async (leadId) => {
            try {
                const response = await fetchLeadDetails(null, false, leadId);
                const plan_enroll_profile_created = response?.consumerId === null ? "No" : "Yes";
                setLeadDetails({ ...response, plan_enroll_profile_created });
                return response;
            } catch (error) {
                showToast({
                    type: "error",
                    message: "Failed to load lead details",
                    time: 10000,
                });
            }
        },
        [fetchLeadDetails, showToast],
    );

    const updateLeadDetailsWithZipCode = useCallback(
        async (reqData) => {
            try {
                const payload = removeNullAndEmptyFields(reqData, ["address"]);
                await editLeadDetails(payload, false, payload.leadsId);
                await getLeadDetails(payload?.leadsId);
            } catch (err) {
                showToast({
                    type: "error",
                    message: `Failed to update county`,
                });
            }
        },
        [editLeadDetails, getLeadDetails, showToast],
    );

    const updateLeadDetails = async (newPayload) => {
        const {
            firstName,
            middleName,
            lastName,
            suffix,
            prefix,
            maritalStatus,
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
            hasMedicAid,
            subsidyLevel,
            gender,
            weight,
            height,
            isTobaccoUser,
            modifyDate,
            consumerId,
        } = newPayload;
        const reqData = {
            leadsId,
            firstName,
            middleName: middleName?.toUpperCase(),
            lastName,
            suffix,
            prefix,
            maritalStatus,
            birthdate: birthdate ? formatServerDate(parseDate(birthdate)) : null,
            leadStatusId,
            primaryCommunication,
            contactRecordType,
            notes,
            hasMedicAid,
            subsidyLevel,
            gender,
            weight,
            height,
            isTobaccoUser,
            modifyDate,
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
        if (consumerId) {
            reqData.consumerId = consumerId;
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

        reqData.phones = [
            {
                phoneId: phoneId,
                ...phones,
                leadPhone: getFormattedPhone(phones.leadPhone),
            },
        ];

        reqData.addresses = [
            {
                leadAddressId: leadAddressId,
                ...address,
            },
        ];

        const payload = removeNullAndEmptyFields(reqData);
        return await performAsyncOperation(
            () => editLeadDetails(payload, false, newPayload.leadsId),
            () => { },
            async (data) => {
                await getLeadDetails(newPayload?.leadsId);
                showToast({
                    message: `Lead updated successfully`,
                });
                return data;
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update lead`,
                }),
        );
    };

    const updateClientNotes = useCallback(
        async (oldPayload, newPayload) => {
            const formattedData = getFormattedData(newPayload, oldPayload);
            await performAsyncOperation(
                () => editLeadDetails(formattedData, false, newPayload.leadsId),
                () => { },
                async () => {
                    await getLeadDetails(newPayload?.leadsId);
                    showToast({
                        message: `Client notes successfully Updated.`,
                    });
                },
                (err) =>
                    showToast({
                        type: "error",
                        message: `Failed to update lead`,
                    }),
            );
        },
        [editLeadDetails, getLeadDetails, showToast],
    );

    const removeContact = useCallback(
        async (leadId, callBack) => {
            await performAsyncOperation(
                () => deleteContact(null, true, leadId),
                () => { },
                () => {
                    callBack();
                },
                (err) =>
                    showToast({
                        type: "error",
                        message: `Failed to delete lead`,
                    }),
            );
        },
        [deleteContact, showToast],
    );

    const contextValue = useMemo(
        () => ({
            getLeadDetails,
            leadDetails,
            leadDetailsError,
            isLoadingLeadDetails,
            selectedTab,
            setSelectedTab,
            updateLeadDetails,
            removeContact,
            updateClientNotes,
            updateLeadDetailsWithZipCode,
        }),
        [
            getLeadDetails,
            leadDetails,
            leadDetailsError,
            isLoadingLeadDetails,
            selectedTab,
            setSelectedTab,
            removeContact,
            updateLeadDetails,
            updateClientNotes,
            updateLeadDetailsWithZipCode,
        ],
    );

    useEffect(() => {
        if (leadID) {
            getLeadDetails(leadID);
        }
    }, [getLeadDetails, leadID]);

    return <LeadDetailsContext.Provider value={contextValue}>{children}</LeadDetailsContext.Provider>;
};

LeadDetailsProvider.propTypes = {
    children: PropTypes.node.isRequired, // PropTypes.node for validating React node types
};
