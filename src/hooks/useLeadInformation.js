import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as Sentry from "@sentry/react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { contactLeadDetailsAtom } from "pages/ContactDetails/state";
import useToast from "hooks/useToast";
import useFetch from "hooks/useFetch";
import { QUOTES_API_VERSION } from "services/clientsService";

const LeadInformationContext = createContext();
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
    console.error("Failed to delete the provider", err);
  } finally {
    setLoading(false);
  }
};

export const useLeadInformation = () => {
  return useContext(LeadInformationContext);
};

export const LeadInformationProvider = ({ children, leadId }) => {
  const { consumerId } = useRecoilValue(contactLeadDetailsAtom);

  const URL = `${process.env.REACT_APP_QUOTE_URL}/api/${QUOTES_API_VERSION}/Lead/${leadId}`;

  const { Post: saveLeadProviders, Delete: deleteLeadProviders } = useFetch(
    `${URL}/Provider`
  );

  const {
    Get: fetchLeadPharmacies,
    Delete: deleteLeadPharmacies,
    Post: saveLeadPharmacies,
  } = useFetch(`${URL}/Pharmacies`);

  const {
    Get: fetchLeadPrescriptions,
    Put: updateLeadPrescription,
    Post: createPrescription,
    Delete: deleteLeadPrescription,
  } = useFetch(`${URL}/Prescriptions`);

  const { Get: fetchLeadProviders } = useFetch(
    `${URL}/Provider/ProviderSearchLookup`
  );

  const [pharmacies, setPharmacies] = useState([]);
  const [pharmacyLoading, setPharmacyLoading] = useState(false);

  const [providers, setProviders] = useState([]);
  const [providerLoading, setProviderLoading] = useState(false);

  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

  const addToast = useToast();

  const fetchPrescriptions = useCallback(async () => {
    await performAsyncOperation(
      fetchLeadPrescriptions,
      setPrescriptionLoading,
      (data) => setPrescriptions(data || [])
    );
  }, [fetchLeadPrescriptions]);

  const fetchPharmacies = useCallback(async () => {
    await performAsyncOperation(
      fetchLeadPharmacies,
      setPharmacyLoading,
      (data) => setPharmacies(data || [])
    );
  }, [fetchLeadPharmacies]);

  const fetchProviders = useCallback(async () => {
    await performAsyncOperation(
      fetchLeadProviders,
      setProviderLoading,
      (data) => setProviders(data?.providers || [])
    );
  }, [fetchLeadProviders]);

  useEffect(() => {
    fetchPrescriptions();
    fetchPharmacies();
    fetchProviders();
  }, [fetchPrescriptions, fetchPharmacies, fetchProviders]);

  // You can create similar functions for add, update, delete for Prescriptions, Pharmacies, and Providers
  const addPrescription = async (item, refresh) => {
    const itemObject = {
      ...(item?.dosage ?? item),
      dosageRecordID: 0,
      packages: null,
      selectedPackage: null,
    };
    await performAsyncOperation(
      () => createPrescription(itemObject, false, consumerId),
      setPrescriptionLoading,
      async () => {
        await fetchPrescriptions();
        if (refresh) {
          await refresh();
        }
        addToast({ message: "Prescription Added" });
      },
      (err) =>
        addToast({
          type: "error",
          message: "Failed to add prescription",
        })
    );
  };

  const editPrescription = async (prescriptionData, refresh) => {
    const { dosage, ...rest } = prescriptionData;
    const updatedData = {
      ...rest,
      dosageID: dosage.dosageID,
    };

    const id = consumerId
      ? `${updatedData.dosageRecordID}/${consumerId}`
      : `${updatedData.dosageRecordID}`;

    await performAsyncOperation(
      () => updateLeadPrescription(updatedData, false, id),
      setPrescriptionLoading,
      async () => {
        await fetchPrescriptions();
        if (refresh) {
          await refresh();
        }
        addToast({ message: "Prescription Updated" });
      },
      (err) => {
        addToast({
          type: "error",
          message: "Failed to update prescription",
        });
        console.error("Failed to delete the provider", err);
      }
    );
  };

  const deletePrescription = async (prescriptionData, refresh) => {
    const dosageRecordID = prescriptionData?.dosage?.dosageRecordID;
    const id = consumerId ? `${dosageRecordID}/${consumerId}` : dosageRecordID;
    await performAsyncOperation(
      () => deleteLeadPrescription(null, false, id),
      setPrescriptionLoading,
      async () => {
        await fetchPrescriptions();
        if (refresh) {
          await refresh();
        }
        addToast({
          type: "success",
          message: "Prescription deleted",
          time: toastTimer,
          link: "UNDO",
          onClickHandler: () => addPrescription(prescriptionData, refresh),
          closeToastRequired: true,
        });
      },
      (err) =>
        addToast({
          type: "error",
          message: "Failed to delete prescription",
        })
    );
  };

  const addPharmacy = async (pharmacy) => {
    await performAsyncOperation(
      () => saveLeadPharmacies(pharmacy, false, consumerId),
      setPharmacyLoading,
      async () => {
        await fetchPharmacies();
        addToast({ message: "Pharmacy Added" });
      },
      (err) => addToast({ type: "error", message: "Failed to add pharmacy" })
    );
  };

  const deletePharmacy = async (pharmacy) => {
    const pharmacyId = pharmacy?.pharmacyRecordID;
    const id = consumerId ? `${pharmacyId}/${consumerId}` : pharmacyId;
    await performAsyncOperation(
      () => deleteLeadPharmacies(null, false, id),
      setPharmacyLoading,
      async () => {
        await fetchPharmacies();
        addToast({
          message: "Pharmacy Deleted",
          time: toastTimer,
          link: "UNDO",
          onClickHandler: () => addPharmacy(pharmacy),
          closeToastRequired: true,
        });
      },
      (err) => addToast({ type: "error", message: "Failed to delete pharmacy" })
    );
  };

  const addProvider = async (
    request,
    providerName,
    refresh,
    isUpdate = false
  ) => {
    await performAsyncOperation(
      () => saveLeadProviders(request, false, consumerId),
      setProviderLoading,
      async () => {
        await fetchProviders();
        if (refresh) {
          await refresh();
        }
        addToast({
          message: `${providerName} ${
            isUpdate ? "updated" : "added to the list."
          }`,
        });
      },
      (err) =>
        addToast({
          type: "error",
          message: `Failed to ${isUpdate ? "update" : "add"} Provider`,
        })
    );
  };

  const deleteProvider = async (payload, providerName, refresh, isToast) => {
    await performAsyncOperation(
      () => deleteLeadProviders(payload, false, consumerId),
      setProviderLoading,
      async () => {
        await fetchProviders();
        if (refresh) {
          await refresh();
        }
        if (isToast) {
          addToast({
            message: `Provider  deleted`,
            link: "UNDO",
            time: toastTimer,
            onClickHandler: () => addProvider(payload, providerName, refresh),
            closeToastRequired: true,
          });
        }
      },
      (err) =>
        addToast({
          type: "error",
          message: `Failed to update Provider`,
        })
    );
  };

  const value = {
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
  };

  return (
    <LeadInformationContext.Provider value={value}>
      {children}
    </LeadInformationContext.Provider>
  );
};

LeadInformationProvider.propTypes = {
  children: PropTypes.node.isRequired,
  leadId: PropTypes.string.isRequired,
};

export default LeadInformationProvider;
