import { useState, useEffect } from "react";
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
          clientService.getLeadProviders(leadId).then(setProviders),
          clientService.getLeadPharmacies(leadId).then(setPharmacies),
        ]);
      } catch (err) {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [setPharmacies, setProviders, setPrescriptions, setIsLoading]);

  const addPharmacy = async () => {};
  const addPrescription = async (item) => {
    try {
      console.log('Add Prescription', item)
      await clientService.createPrescription(leadId, item)
      await clientService.getLeadPrescriptions(leadId).then(setPrescriptions)
      addToast({
        message: "Created successfully",
        time: 10000,
      });
    } catch (err) {

    }
  };
  const addProvider = async () => {};

  
  const deletePrescription = async (item) => {
    try {
      // todo call deletePrescription api 
      console.log('Delete Prescription', item)
      await clientService.deletePrescription(leadId, item.dosageRecordID)
      await clientService.getLeadPrescriptions(leadId).then(setPrescriptions)
      addToast({
        type: "success",
        message: " Deleted",
        time: 10000,
        link: "UNDO",
        onClickHandler: () => addPrescription(item),
        closeToastRequired: true,
      });

    } catch(err) {
      // TODO: handle error
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
    addProvider,
    deletePrescription,
  };
};
