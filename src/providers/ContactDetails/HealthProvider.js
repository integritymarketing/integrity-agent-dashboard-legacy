import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import * as Sentry from "@sentry/react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { contactLeadDetailsAtom } from "pages/ContactDetails/state";
import useToast from "hooks/useToast";
import useFetch from "hooks/useFetch";
import { QUOTES_API_VERSION } from "services/clientsService";

const toastTimer = 10000;

const performAsyncOperation = async (
    operation,
    setLoading,
    onSuccess,
    onError
) => {
    setLoading(true);
    try {
        const data = await operation();
        onSuccess(data);
    } catch (err) {
        Sentry.captureException(err);
        onError && onError(err);
    } finally {
        setLoading(false);
    }
};


export const HealthContext = createContext();

export const HealthProvider = ({ children }) => {

    const { consumerId } = useRecoilValue(contactLeadDetailsAtom);

    const URL = `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead`;

    const { Post: saveLeadProviders, Delete: deleteLeadProviders, Get: fetchLeadProviders } = useFetch(URL);

    const {
        Get: fetchLeadPharmacies,
        Delete: deleteLeadPharmacies,
        Post: saveLeadPharmacies,
    } = useFetch(URL);

    const { Get: fetchLeadPrescriptions, Delete: deleteLeadPrescription, Post: createPrescription } = useFetch(URL);


    const { Post: updateLeadPrescription } = useFetch(URL);


    const [pharmacies, setPharmacies] = useState([]);
    const [pharmacyLoading, setPharmacyLoading] = useState(false);

    const [providers, setProviders] = useState([]);
    const [providerLoading, setProviderLoading] = useState(false);

    const [prescriptions, setPrescriptions] = useState([]);
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);

    const showToast = useToast();



    const fetchPrescriptions = async (leadId) => {
        const path = `${leadId}/Prescriptions`
        await performAsyncOperation(
            () => fetchLeadPrescriptions(null, false, path),
            setPrescriptionLoading,
            (data) => setPrescriptions(data || [])
        );
    };


    const fetchPharmacies = async (leadId) => {
        const path = `${leadId}/Pharmacies`
        await performAsyncOperation(
            () => fetchLeadPharmacies(null, false, path),
            setPharmacyLoading,
            (data) => {
                setPharmacies(data || [])
            }
        );
    };




    const fetchProviders = async (leadId) => {
        const path = `${leadId}/Provider/ProviderSearchLookup`
        await performAsyncOperation(
            () => fetchLeadProviders(null, false, path),
            setProviderLoading,
            (data) => setProviders(data?.providers || []),
        );
    };



    const addPrescription = async (item, refresh, leadId) => {
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
            (err) =>
                showToast({
                    type: "error",
                    message: "Failed to add prescription",
                })
        );
    };

    const editPrescription = async (prescriptionData, refresh, leadId) => {
        const { dosage, ...rest } = prescriptionData;
        const updatedData = {
            ...rest,
            dosageID: dosage.dosageID,
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
            (err) => {
                showToast({
                    type: "error",
                    message: "Failed to update prescription",
                });
                console.error("Failed to delete the provider", err);
            }
        );
    };

    const deletePrescription = async (prescriptionData, refresh, leadId) => {
        const dosageRecordID = prescriptionData?.dosage?.dosageRecordID;
        const path = consumerId ? `${leadId}/Prescriptions/${dosageRecordID}/${consumerId}` : `${leadId}/Prescriptions/${dosageRecordID}`;
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
            (err) =>
                showToast({
                    type: "error",
                    message: "Failed to delete prescription",
                })
        );
    };

    const addPharmacy = async (pharmacy, refresh, leadId) => {
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
            (err) => showToast({ type: "error", message: "Failed to add pharmacy" })
        );
    };

    const deletePharmacy = async (pharmacy, refresh, leadId) => {
        const pharmacyId = pharmacy?.pharmacyRecordID;
        const path = consumerId ? `${leadId}/Pharmacies/${pharmacyId}/${consumerId}` : `${leadId}/Pharmacies/${pharmacyId}`;
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
                    link: "UNDO",
                    onClickHandler: () => addPharmacy(pharmacy, null, leadId),
                    closeToastRequired: true,
                });
            },
            (err) => showToast({ type: "error", message: "Failed to delete pharmacy" })
        );
    };

    const addProvider = async (
        request,
        providerName,
        refresh,
        isUpdate = false,
        leadId
    ) => {
        const path = consumerId ? `${leadId}/Provider/${consumerId}` : `${leadId}/Provider`;

        await performAsyncOperation(
            () => saveLeadProviders(request, false, path),
            setProviderLoading,
            async () => {
                await fetchProviders(leadId);
                if (refresh) {
                    await refresh();
                }
                showToast({
                    message: `${providerName} ${isUpdate ? "updated" : "added to the list."
                        }`,
                });
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to ${isUpdate ? "update" : "add"} Provider`,
                })
        );
    };

    const deleteProvider = async (payload, providerName, refresh, isToast, leadId) => {
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
                        message: `Provider  deleted`,
                        link: "UNDO",
                        time: toastTimer,
                        onClickHandler: () => addProvider(payload, providerName, refresh, null, leadId),
                        closeToastRequired: true,
                    });
                }
            },
            (err) =>
                showToast({
                    type: "error",
                    message: `Failed to update Provider`,
                })
        );
    };


    const contextValue = useMemo(
        () => ({
            pharmacies,
            pharmacyLoading,
            providers,
            providerLoading,
            prescriptions,
            prescriptionLoading,
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
        [pharmacies,
            pharmacyLoading,
            providers,
            providerLoading,
            prescriptions,
            prescriptionLoading,
        ]
    );


    return <HealthContext.Provider value={contextValue}>{children}</HealthContext.Provider>;

};

HealthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Child components that this provider will wrap
};












