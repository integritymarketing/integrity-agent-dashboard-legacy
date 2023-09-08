import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as Sentry from "@sentry/react";
import PropTypes from "prop-types";

import useToast from "hooks/useToast";
import clientsService from "services/clientsService";

const LeadInformationContext = createContext();

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
    onError(err);
  } finally {
    setLoading(false);
  }
};

export const useLeadInformation = () => {
  return useContext(LeadInformationContext);
};

export const LeadInformationProvider = ({ children, leadId }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [pharmacyLoading, setPharmacyLoading] = useState(false);

  const [providers, setProviders] = useState([]);
  const [providerLoading, setProviderLoading] = useState(false);

  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

  const addToast = useToast();

  const fetchPrescriptions = useCallback(() => {
    const operation = () => clientsService.getLeadPrescriptions(leadId);
    performAsyncOperation(operation, setPrescriptionLoading, setPrescriptions);
  }, [leadId]);

  const fetchPharmacies = useCallback(() => {
    const operation = () => clientsService.getLeadPharmacies(leadId);
    performAsyncOperation(operation, setPharmacyLoading, setPharmacies);
  }, [leadId]);

  const fetchProviders = useCallback(() => {
    const operation = () => clientsService.getLeadProviders(leadId);
    performAsyncOperation(operation, setProviderLoading, (data) =>
      setProviders(data?.providers || [])
    );
  }, [leadId]);

  useEffect(() => {
    fetchPrescriptions();
    fetchPharmacies();
    fetchProviders();
  }, [fetchPrescriptions, fetchPharmacies, fetchProviders]);

  // You can create similar functions for add, update, delete for Prescriptions, Pharmacies, and Providers
  const addPrescription = (item, refresh) => {
    const itemObject = {
      ...(item?.dosage ?? item),
      dosageRecordID: 0,
      packages: null,
      selectedPackage: null,
    };
    performAsyncOperation(
      () => clientsService.createPrescription(leadId, itemObject),
      setPrescriptionLoading,
      async () => {
        await fetchPrescriptions();
        refresh && (await refresh());
        addToast({ message: "Prescription Added" });
      },
      (err) =>
        addToast({ type: "error", message: "Failed to add prescription" })
    );
  };

  const editPrescription = (prescriptionData, refresh) => {
    const { dosage, ...rest } = prescriptionData;
    const updatedData = {
      ...rest,
      dosageID: dosage.dosageID,
    };

    performAsyncOperation(
      () => clientsService.updatePrescription(leadId, updatedData),
      setPrescriptionLoading,
      async () => {
        await fetchPrescriptions();
        refresh && (await refresh());
        addToast({ message: "Prescription Updated" });
      },
      (err) =>
        addToast({ type: "error", message: "Failed to update prescription" })
    );
  };

  const deletePrescription = async (prescriptionData, refresh) => {
    const dosageRecordID = prescriptionData?.dosage?.dosageRecordID;
    await performAsyncOperation(
      () => clientsService.deletePrescription(leadId, dosageRecordID),
      setPrescriptionLoading,
      async () => {
        await fetchPrescriptions();
        refresh && (await refresh());
        addToast({
          type: "success",
          message: "Prescription deleted",
          time: 10000,
          link: "UNDO",
          onClickHandler: () => addPrescription(prescriptionData, refresh),
          closeToastRequired: true,
        });
      },
      (err) =>
        addToast({ type: "error", message: "Failed to delete prescription" })
    );
  };

  const addPharmacy = (pharmacy) => {
    performAsyncOperation(
      () => clientsService.createPharmacy(leadId, pharmacy),
      setPharmacyLoading,
      async () => {
        await fetchPharmacies();
        addToast({ message: "Pharmacy Added" });
      },
      (err) => addToast({ type: "error", message: "Failed to add pharmacy" })
    );
  };

  const deletePharmacy = (pharmacy) => {
    const pharmacyId = pharmacy?.pharmacyRecordID;
    performAsyncOperation(
      () => clientsService.deletePharmacy(leadId, pharmacyId),
      setPharmacyLoading,
      async () => {
        await fetchPharmacies();
        addToast({
          message: "Pharmacy Deleted",
          time: 10000,
          link: "UNDO",
          onClickHandler: () => addPharmacy(pharmacy),
          closeToastRequired: true,
        });
      },
      (err) => addToast({ type: "error", message: "Failed to delete pharmacy" })
    );
  };

  const addProvider = (request, providerName, refresh) => {
    performAsyncOperation(
      () => clientsService.createLeadProvider(leadId, request),
      setProviderLoading,
      async () => {
        await fetchProviders();
        refresh && (await refresh());
        addToast({ message: `${providerName} added to the list.` });
      },
      (err) => addToast({ type: "error", message: "Failed to add Provider" })
    );
  };

  const deleteProvider = (payload, providerName, refresh, isDelete) => {
    performAsyncOperation(
      () => clientsService.deleteProvider(payload, leadId),
      setProviderLoading,
      async () => {
        await fetchProviders();
        refresh && (await refresh());
        addToast({
          message: "Provider Deleted",
          link: "UNDO",
          onClickHandler: () => addProvider(payload, providerName, refresh),
          closeToastRequired: true,
        });
      },
      (err) =>
        addToast({
          type: "error",
          message: `Failed to ${isDelete ? "delete" : "update"} Provider`,
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
