import { useState, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/react";
import useToast from "hooks/useToast";
import clientsService from "services/clientsService";
import { useRecoilValue } from "recoil";
import {contactLeadDetailsAtom } from "pages/ContactDetails/state"; 

const useLeadInformation = (leadId) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [providers, setProviders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const addToast = useToast(); 
  const {
    consumerId,
  } = useRecoilValue(contactLeadDetailsAtom);
  debugger
  const handleGetProviders = useCallback((data) => {
    setProviders(data?.providers || []);
  }, []);

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
  }, [setPharmacies, setPrescriptions, setIsLoading, leadId, handleGetProviders]);

  const addPrescription = useCallback(async (item, refresh) => {
    try {
      setIsLoading(true);
      const itemObject = {
        ...(item?.dosage ?? item),
        dosageRecordID: 0,
        packages: null,
        selectedPackage: null,
      };
      await clientsService.createPrescription(leadId, itemObject, consumerId);
      setPrescriptions(await clientsService.getLeadPrescriptions(leadId));
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
  }, [addToast, consumerId, leadId, setPrescriptions]);
  
  const editPrescription = useCallback(async ({ dosage = {}, ...rest }, refresh) => {
    setIsLoading(true);
    try {
      const item = {
        ...rest,
        dosageID: dosage.dosageID,
      };
      await clientsService.editPrescription(leadId, item, consumerId);
      setPrescriptions(await clientsService.getLeadPrescriptions(leadId));
      addToast({
        message: "Prescription updated successfully",
      });
      refresh && (await refresh());
    } catch (err) {
      Sentry.captureException(err);
      addToast({
        type: "error",
        message: "Failed to update prescription",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, consumerId, leadId, setPrescriptions]);

  const deletePrescription = useCallback(async (item, refresh) => {
    setIsLoading(true);
    try {
      await clientsService.deletePrescription(leadId, item?.dosage?.dosageRecordID, consumerId);
      setPrescriptions(await clientsService.getLeadPrescriptions(leadId));
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
  }, [addPrescription, addToast, consumerId, leadId, setPrescriptions]);  

  const addPharmacy = useCallback(async (item) => {
    setIsLoading(true);
    try {
      await clientsService.createPharmacy(leadId, item, consumerId);
      setPharmacies(await clientsService.getLeadPharmacies(leadId));
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
  }, [addToast, consumerId, leadId, setPharmacies]);
  
  const deletePharmacy = useCallback(async (item) => {
    setIsLoading(true);
    try {
      await clientsService.deletePharmacy(leadId, item.pharmacyRecordID, consumerId);
      setPharmacies(await clientsService.getLeadPharmacies(leadId));
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
  }, [addPharmacy, addToast, consumerId, leadId, setPharmacies]);
  
  const addProvider = useCallback(async (request, providerName, refresh) => {
    setIsLoading(true);
    try {
      await clientsService.createLeadProvider(leadId, request, consumerId);
      handleGetProviders(await clientsService.getLeadProviders(leadId));
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
  }, [addToast, consumerId, handleGetProviders, leadId]);  

  const deleteProvider = useCallback(async (payload, providerName, refresh, isDelete) => {
    setIsLoading(true);
  
    try {
      await clientsService.deleteProvider(payload, leadId, consumerId);
      handleGetProviders(await clientsService.getLeadProviders(leadId));
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
        message: `Failed to ${isDelete ? "delete" : "update"} Provider`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [addProvider, addToast, consumerId, handleGetProviders, leadId]);

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
