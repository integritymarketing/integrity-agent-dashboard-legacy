import * as Sentry from "@sentry/react";
import state from "./state";
import { useSetRecoilState, useRecoilState } from "recoil";
import { useEffect, useState, useCallback } from "react";
import clientsService from "services/clientsService";

const useContactDetails = (leadId) => {
  const setLeadId = useSetRecoilState(state.atoms.contactLeadIdAtom);
  const [leadDetails, setLeadDetails] = useRecoilState(
    state.atoms.contactLeadDetailsAtom
  );
  const [isLoading, setIsLoading] = useState(true);

  const getLeadDetails = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const results = await clientsService.getContactInfo(leadId);
      setLeadDetails(results);
    } catch (error) {
      Sentry.captureException(error);
      setLeadDetails([]);
    } finally {
      setIsLoading(false);
    }
  }, [leadId, setLeadDetails, setIsLoading]);

  useEffect(() => {
    setLeadId(leadId);
    if (leadId && leadId !== String(leadDetails?.leadsId)) {
      getLeadDetails(leadId);
    }
  }, [setLeadId, leadId, getLeadDetails, leadDetails]);

  return {
    leadId,
    leadDetails,
    isLoading,
    getLeadDetails,
  };
};

export default useContactDetails;
