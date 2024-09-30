/* eslint-disable default-param-last */
/* eslint-disable max-lines-per-function */
import React, { createContext, useState, useMemo, useCallback } from "react";
import * as Sentry from "@sentry/react";
import PropTypes from "prop-types";
import useToast from "hooks/useToast";
import useFetch from "hooks/useFetch";
import { QUOTES_API_VERSION } from "services/clientsService";
import { useLeadDetails } from "providers/ContactDetails";

const toastTimer = 10000;

const performAsyncOperation = async (operation, setLoading, onSuccess, onError) => {
    setLoading(true);
    try {
        const data = await operation();
        if (data?.status === 400) {
            throw new Error(data);
        }
        onSuccess(data);
        return data;
    } catch (err) {
        Sentry.captureException(err);
        if (onError) {
            onError(err);
        }
    } finally {
        setLoading(false);
    }
};

export const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
    const { leadDetails } = useLeadDetails();
    const { consumerId } = leadDetails || {};

    const URL = `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead`;
    const URL_V2 = `${process.env.REACT_APP_QUOTE_URL}/api/v2.0/Lead`;

    const { Post: saveLeadProviders, Delete: deleteLeadProviders, Get: fetchLeadProviders } = useFetch(URL);
    const { Post: saveLeadPharmacies } = useFetch(URL_V2);
    const { Get: fetchLeadPharmacies, Delete: deleteLeadPharmacies } = useFetch(URL);
    const { Put: putLeadPharmacies } = useFetch(URL_V2);
    const { Get: fetchLeadPrescriptions, Delete: deleteLeadPrescription, Post: createPrescription } = useFetch(URL);
    const { Post: updateLeadPrescription } = useFetch(URL);

    const [pharmacies, setPharmacies] = useState([]);
    const [pharmacyLoading, setPharmacyLoading] = useState(false);
    const [providers, setProviders] = useState([]);
    const [providerLoading, setProviderLoading] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);

    const showToast = useToast();

    const fetchPrescriptions = useCallback(
        async (leadId) => {
            if (!leadId) {
                return;
            }
            const path = `${leadId}/Prescriptions`;
            await performAsyncOperation(
                () => fetchLeadPrescriptions(null, false, path),
                setPrescriptionLoading,
                (data) => setPrescriptions(data || [])
            );
        },
        [fetchLeadPrescriptions]
    );

    const fetchPharmacies = useCallback(
        async (leadId) => {
            if (!leadId) {
                return;
            }
            const path = `${leadId}/Pharmacies`;
            const updatedData = await performAsyncOperation(
                () => fetchLeadPharmacies(null, false, path),
                setPharmacyLoading,
                (data) => setPharmacies(data || [])
            );
            return updatedData || [];
        },
        [fetchLeadPharmacies]
    );

    const putLeadPharmacy = useCallback(
        async (leadId, pharmacyData) => {
            const path = `${leadId}/Pharmacies`;
            await performAsyncOperation(
                () => putLeadPharmacies(pharmacyData, false, path),
                setPharmacyLoading,
                (data) => { }
            );
        },
        [putLeadPharmacies]
    );

    const fetchProviders = useCallback(
        async (leadId) => {
            if (!leadId) {
                return;
            }
            const path = `${leadId}/Provider/ProviderSearchLookup`;
            await performAsyncOperation(
                () => fetchLeadProviders(null, false, path),
                setProviderLoading,
                (data) => setProviders(data?.providers || [])
            );
        },
        [fetchLeadProviders]
    );

    const addPrescription = useCallback(
        async (item, refresh, leadId) => {
            if (!item || !leadId) {
                return;
            }
            const itemObject = {
                ...(item?.dosage ?? item),
                dosageRecordID: 0,
                packages: null,
                selectedPackage: null,
            };

            const path = consumerId ? `${leadId}/Prescriptions/syncid/${consumerId}` : `${leadId}/Prescriptions/syncid`;

            await performAsyncOperation(
                () => createPrescription(itemObject, false, path),
                setPrescriptionLoading,
                async () => {
                    await fetchPrescriptions(leadId);
                    if (refresh) {
                        await refresh();
                    }
                    showToast({ message: "Prescription Added" });
                },
                () => showToast({ type: "error", message: "Failed to add prescription" })
            );
        },
        [consumerId, createPrescription, fetchPrescriptions, showToast]
    );

    const editPrescription = useCallback(
        async (prescriptionData, refresh, leadId) => {
            if (!prescriptionData || !leadId) {
                return;
            }
            const { dosage, ...rest } = prescriptionData;
            const updatedData = {
                ...rest,
                dosageID: dosage?.dosageID || null,
            };
            const path = consumerId
                ? `${leadId}/Prescriptions/${updatedData.dosageRecordID}/syncid/${consumerId}`
                : `${leadId}/Prescriptions/${updatedData.dosageRecordID}/syncid`;

            await performAsyncOperation(
                () => updateLeadPrescription(updatedData, false, path),
                setPrescriptionLoading,
                async () => {
                    await fetchPrescriptions(leadId);
                    if (refresh) {
                        await refresh();
                    }
                    showToast({ message: "Prescription Updated" });
                },
                () => showToast({ type: "error", message: "Failed to update prescription" })
            );
        },
        [consumerId, fetchPrescriptions, showToast, updateLeadPrescription]
    );

    const deletePrescription = useCallback(
        async (prescriptionData, refresh, leadId) => {
            if (!prescriptionData || !leadId) {
                return;
            }
            const dosageRecordID = prescriptionData?.dosage?.dosageRecordID;
            if (!dosageRecordID) {
                return;
            }
            const path = consumerId
                ? `${leadId}/Prescriptions/${dosageRecordID}/${consumerId}`
                : `${leadId}/Prescriptions/${dosageRecordID}`;
            await performAsyncOperation(
                () => deleteLeadPrescription(null, false, path),
                setPrescriptionLoading,
                async () => {
                    await fetchPrescriptions(leadId);
                    if (refresh) {
                        await refresh();
                    }
                    showToast({
                        type: "success",
                        message: "Prescription deleted",
                        time: toastTimer,
                        link: "UNDO",
                        onClickHandler: () => addPrescription(prescriptionData, null, leadId),
                        closeToastRequired: true,
                    });
                },
                () => showToast({ type: "error", message: "Failed to delete prescription" })
            );
        },
        [addPrescription, consumerId, deleteLeadPrescription, fetchPrescriptions, showToast]
    );

    const addPharmacy = useCallback(
        async (pharmacy, refresh, leadId) => {
            if (!pharmacy || !leadId) {
                return;
            }
            const path = consumerId ? `${leadId}/Pharmacies/${consumerId}` : `${leadId}/Pharmacies`;
            await performAsyncOperation(
                () => saveLeadPharmacies(pharmacy, true, path),
                setPharmacyLoading,
                async () => {
                    await fetchPharmacies(leadId);
                    if (refresh) {
                        await refresh();
                    }
                    showToast({ message: "Pharmacy Added" });
                },
                () => showToast({ type: "error", message: "Failed to add pharmacy" })
            );
        },
        [consumerId, fetchPharmacies, saveLeadPharmacies, showToast]
    );

    const deletePharmacy = useCallback(
        async (pharmacy, refresh, leadId) => {
            if (!pharmacy || !leadId) {
                return;
            }
            const pharmacyId = pharmacy?.pharmacyRecordID;
            if (!pharmacyId) {
                return;
            }
            const path = consumerId
                ? `${leadId}/Pharmacies/${pharmacyId}/${consumerId}`
                : `${leadId}/Pharmacies/${pharmacyId}`;
            await performAsyncOperation(
                () => deleteLeadPharmacies(null, true, path),
                setPharmacyLoading,
                async () => {
                    await fetchPharmacies(leadId);
                    if (refresh) {
                        await refresh();
                    }
                    showToast({
                        message: "Pharmacy Deleted",
                        time: toastTimer,
                        onClickHandler: () => addPharmacy(pharmacy, null, leadId),
                        closeToastRequired: true,
                    });
                },
                () => showToast({ type: "error", message: "Failed to delete pharmacy" })
            );
        },
        [addPharmacy, consumerId, deleteLeadPharmacies, fetchPharmacies, showToast]
    );

    const addProvider = useCallback(
        async (request, providerName, refresh, isUpdate = false, leadId) => {
            if (!request || !providerName || !leadId) {
                return;
            }
            const path = consumerId ? `${leadId}/Provider/${consumerId}` : `${leadId}/Provider`;

            await performAsyncOperation(
                () => saveLeadProviders(request, false, path),
                setProviderLoading,
                async () => {
                    await fetchProviders(leadId);
                    if (refresh) {
                        await refresh();
                    }
                    showToast({ message: `${providerName} ${isUpdate ? "updated" : "added to the list."}` });
                },
                () => showToast({ type: "error", message: `Failed to ${isUpdate ? "update" : "add"} Provider` })
            );
        },
        [consumerId, fetchProviders, saveLeadProviders, showToast]
    );

    const deleteProvider = useCallback(
        async (payload, providerName, refresh, isToast, leadId) => {
            if (!payload || !providerName || !leadId) {
                return;
            }
            const path = consumerId ? `${leadId}/Provider/${consumerId}` : `${leadId}/Provider`;

            await performAsyncOperation(
                () => deleteLeadProviders(payload, false, path),
                setProviderLoading,
                async () => {
                    await fetchProviders(leadId);
                    if (refresh) {
                        await refresh();
                    }
                    if (isToast) {
                        showToast({
                            message: `Provider deleted`,
                            link: "UNDO",
                            time: toastTimer,
                            onClickHandler: () => addProvider(payload, providerName, refresh, null, leadId),
                            closeToastRequired: true,
                        });
                    }
                },
                () => showToast({ type: "error", message: `Failed to update Provider` })
            );
        },
        [addProvider, consumerId, deleteLeadProviders, fetchProviders, showToast]
    );

    const contextValue = useMemo(
        () => ({
            pharmacies,
            pharmacyLoading,
            providers,
            providerLoading,
            prescriptions,
            prescriptionLoading,
            putLeadPharmacy,
            addPharmacy,
            addPrescription,
            editPrescription,
            deletePrescription,
            deletePharmacy,
            addProvider,
            deleteProvider,
            fetchPrescriptions,
            fetchPharmacies,
            fetchProviders,
        }),
        [
            pharmacies,
            pharmacyLoading,
            providers,
            providerLoading,
            prescriptions,
            prescriptionLoading,
            putLeadPharmacy,
            addPharmacy,
            addPrescription,
            editPrescription,
            deletePrescription,
            deletePharmacy,
            addProvider,
            deleteProvider,
            fetchPrescriptions,
            fetchPharmacies,
            fetchProviders,
        ]
    );

    return <HealthContext.Provider value={contextValue}>{children}</HealthContext.Provider>;
};

HealthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};