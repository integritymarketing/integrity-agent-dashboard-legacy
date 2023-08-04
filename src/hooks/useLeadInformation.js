import { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { useClientServiceContext } from "services/clientServiceProvider";
import useToast from "hooks/useToast";

export default (leadId) => {
  const { clientsService } = useClientServiceContext();
  const [pharmacies, setPharmacies] = useState([]);
  const [providers, setProviders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const addToast = useToast();

  useEffect(() => {
    const getData = async () => {
      try {
        await Promise.all([
          clientsService.getLeadPrescriptions(leadId).then(setPrescriptions),
          clientsService.getLeadPharmacies(leadId).then(setPharmacies),
        ]);
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [
    setPharmacies,
    setProviders,
    setPrescriptions,
    setIsLoading,
    leadId,
    clientsService,
  ]);

  const addPrescription = async (item) => {
    const itemObject = {
      ...(item?.dosage ?? item),
      dosageRecordID: 0,
      packages: null,
      selectedPackage: null,
    };
    try {
      await clientsService.createPrescription(leadId, itemObject);
      await clientsService.getLeadPrescriptions(leadId).then(setPrescriptions);
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

  const editPrescription = async ({ dosage = {}, ...rest }) => {
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
      await clientsService.deletePrescription(
        leadId,
        item?.dosage?.dosageRecordID
      );
      await clientsService.getLeadPrescriptions(leadId).then(setPrescriptions);
      addToast({
        type: "success",
        message: "Prescription deleted",
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
    }
  };

  const deletePharmacy = async (item) => {
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
  };
};
