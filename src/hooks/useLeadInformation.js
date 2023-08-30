import { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";

const useLeadInformation = (leadId) => {
  const { clientsService } = useClientServiceContext();
  const [pharmacies, setPharmacies] = useState([]);
  const [providers, setProviders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const addToast = useToast();

  const handleGetProviders = (data) => {
    if (data?.providers?.length > 0) {
      setProviders(data?.providers);
    } else {
      setProviders([]);
    }
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          clientsService.getLeadPrescriptions(leadId).then(setPrescriptions),
          clientsService.getLeadPharmacies(leadId).then(setPharmacies),
          clientsService.getLeadProviders(leadId).then(handleGetProviders),
        ]);
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [setPharmacies, setPrescriptions, setIsLoading, leadId, clientsService]);

  const addPrescription = async (item, refresh) => {
    setIsLoading(true);
    const itemObject = {
      ...(item?.dosage ?? item),
      dosageRecordID: 0,
      packages: null,
      selectedPackage: null,
    };
    try {
      await clientsService.createPrescription(leadId, itemObject);
      await clientsService.getLeadPrescriptions(leadId).then(setPrescriptions);
      refresh && (await refresh());
      addToast({
        message: "Prescription Added",
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to add prescription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editPrescription = async ({ dosage = {}, ...rest }, refresh) => {
    setIsLoading(true);
    try {
      const item = {
        ...rest,
        dosageID: dosage.dosageID,
      };
      await clientsService.editPrescription(leadId, item);
      addToast({
        message: "Prescription updated successfully",
      });
      await clientsService.getLeadPrescriptions(leadId).then(setPrescriptions);
      refresh && (await refresh());
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to updated prescription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePrescription = async (item, refresh) => {
    setIsLoading(true);
    try {
      await clientsService.deletePrescription(
        leadId,
        item?.dosage?.dosageRecordID
      );
      await clientsService.getLeadPrescriptions(leadId).then(setPrescriptions);
      refresh && (await refresh());
      addToast({
        type: "success",
        message: "Prescription deleted",
        time: 10000,
        link: "UNDO",
        onClickHandler: () => addPrescription(item, refresh),
        closeToastRequired: true,
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to delete prescription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPharmacy = async (item) => {
    setIsLoading(true);
    try {
      await clientsService.createPharmacy(leadId, item);
      await clientsService.getLeadPharmacies(leadId).then(setPharmacies);
      addToast({
        message: "Pharmacy Added",
        time: 10000,
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to add pharmacy",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePharmacy = async (item) => {
    setIsLoading(true);
    try {
      await clientsService.deletePharmacy(leadId, item.pharmacyRecordID);
      await clientsService.getLeadPharmacies(leadId).then(setPharmacies);
      addToast({
        message: "Pharmacy Deleted",
        time: 10000,
        link: "UNDO",
        onClickHandler: () => addPharmacy(item),
        closeToastRequired: true,
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to delete pharmacy",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProvider = async (request, providerName, refresh) => {
    setIsLoading(true);
    debugger;
    try {
      await clientsService.createLeadProvider(leadId, request);
      await clientsService.getLeadProviders(leadId).then(handleGetProviders);
      refresh && (await refresh());
      addToast({
        message: providerName + " added to the list. ",
        time: 10000,
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to add Provider",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProvider = async (payload, providerName, refresh) => {
    setIsLoading(true);

    try {
      await clientsService.deleteProvider(payload, leadId);
      await clientsService.getLeadProviders(leadId).then(handleGetProviders);
      refresh && (await refresh());
      addToast({
        message: "Provider Deleted",
        time: 10000,
        link: "UNDO",
        onClickHandler: () => addProvider(payload, providerName, refresh),
        closeToastRequired: true,
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to delete pharmacy",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pharmacies,
    providers,
    prescriptions,
    isLoading,
    addPharmacy,
    addPrescription,
    editPrescription,
    deletePrescription,
    deletePharmacy,
    addProvider,
    deleteProvider,
  };
};

export default useLeadInformation;
