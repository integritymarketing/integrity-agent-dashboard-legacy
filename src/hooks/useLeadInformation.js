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
  }, [setPharmacies, setProviders, setPrescriptions, setIsLoading]);

  const addPrescription = async (item) => {
    try {
      await clientService.createPrescription(leadId, item);
      await clientService.getLeadPrescriptions(leadId).then(setPrescriptions);
      addToast({
        message: "Prescription Added",
      });
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  const editPrescription = async (item) => {
    try {
      await clientService.editPrescription(leadId, item);
      addToast({
        message: "Prescription Edited",
      });
      await clientService.getLeadPrescriptions(leadId).then(setPrescriptions);
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  const deletePrescription = async (item) => {
    try {
      console.log("Delete Prescription", item);
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
    }
  };

  const addPharmacy = async (item) => {
    try {
      console.log("Add Prescription", item);
      await clientService.createPharmacy(leadId, item);
      await clientService.getLeadPharmacies(leadId).then(setPharmacies);
      addToast({
        message: "Pharmacy Added",
        time: 10000,
      });
    } catch (err) {}
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
    }
  };

  return {
    pharmacies,
    providers,
    prescriptions,
    isLoading,
    isSaving,
    addPharmacy,
    addPrescription,
    editPrescription,
    deletePrescription,
    deletePharmacy,
  };
};
