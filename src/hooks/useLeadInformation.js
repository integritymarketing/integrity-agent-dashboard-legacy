import { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import clientService from "services/clientsService";
import useToast from "hooks/useToast";

export default (leadId) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [providers, setProviders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    //below itemObject has been cloned for the undo to work properly
    const itemObject = {
      ...(item?.dosage ?? item),
      dosageRecordID: 0,
      packages: null,
      selectedPackage: null,
    };
    try {
      await clientService.createPrescription(leadId, itemObject);
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

  const editPrescription = async ({
    dosage = {},
    isDosageLabelNameChanged = false,
    ...rest
  }) => {
    try {
      const item = isDosageLabelNameChanged
        ? {
            ...rest,
            ndc: dosage.referenceNDC,
            metricQuantity: dosage.metricQuantity,
            dosageID: dosage.dosageID,
            quantity: dosage.commonMetricQuantity,
            userQuantity: dosage.commonUserQuantity,
            daysOfSupply: 0,
            packages: null
          }
        : rest;

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
      await clientService.deletePrescription(
        leadId,
        item?.dosage?.dosageRecordID
      );
      await clientService.getLeadPrescriptions(leadId).then(setPrescriptions);
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
    addPharmacy,
    addPrescription,
    editPrescription,
    deletePrescription,
    deletePharmacy,
  };
};
