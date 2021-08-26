import { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import clientService from "services/clientsService";
import useToast from "hooks/useToast";

export default (leadId) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [providers, setProviders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    const getData = async () => {
      try {
        await Promise.all([
          clientService.getLeadPrescriptions(leadId).then(setPrescriptions),
          clientService.getLeadPharmacies(leadId).then(setPharmacies),
        ]);
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [setPharmacies, setProviders, setPrescriptions, setIsLoading, leadId]);

  const addPrescription = async (item) => {
    try {
      await clientService.createPrescription(leadId, item);
      await clientService.getLeadPrescriptions(leadId).then(setPrescriptions);
      addToast({
        message: "Prescription Added",
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to add prescription",
      });
    }
  };

  const editPrescription = async (item) => {
    try {
      await clientService.editPrescription(leadId, item);
      addToast({
        message: "Prescription updated successfully",
      });
      await clientService.getLeadPrescriptions(leadId).then(setPrescriptions);
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to updated prescription",
      });
    }
  };

  const deletePrescription = async (item) => {
    try {
      await clientService.deletePrescription(leadId, item.dosageRecordID);
      await clientService.getLeadPrescriptions(leadId).then(setPrescriptions);
      addToast({
        type: "success",
        message: " Deleted",
        time: 10000,
        link: "UNDO",
        onClickHandler: () => addPrescription(item),
        closeToastRequired: true,
      });
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to delete prescription",
      });
    }
  };

  const addPharmacy = async (item) => {
    try {
      await clientService.createPharmacy(leadId, item);
      await clientService.getLeadPharmacies(leadId).then(setPharmacies);
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
    }
  };

  const deletePharmacy = async (item) => {
    try {
      await clientService.deletePharmacy(leadId, item.pharmacyRecordID);
      await clientService.getLeadPharmacies(leadId).then(setPharmacies);
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
    }
  };

  return {
    pharmacies,
    providers,
    prescriptions,
    isLoading,
    isSaving,
    setIsSaving,
    addPharmacy,
    addPrescription,
    editPrescription,
    deletePrescription,
    deletePharmacy,
  };
};
