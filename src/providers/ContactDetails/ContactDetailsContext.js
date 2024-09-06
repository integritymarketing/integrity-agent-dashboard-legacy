import { useContext } from "react";

import { LeadDetailsContext } from "./LeadDetailsProvider";
import { HealthContext } from "./HealthProvider";
import { OverViewContext } from "./OverViewProvider";
import { PoliciesContext } from "./PoliciesProvider";
import { ScopeOfAppointmentContext } from "./ScopeOfAppointmentProvider";
import { DuplicateContactsContext } from "./DuplicatesContactsProvider";
import { CallsContext } from "./CallsProvider";


export const useLeadDetails = () => useContext(LeadDetailsContext) ?? {};
export const useOverView = () => useContext(OverViewContext) ?? {};
export const useHealth = () => useContext(HealthContext) ?? {};
export const usePolicies = () => useContext(PoliciesContext) ?? {};
export const useScopeOfAppointment = () => useContext(ScopeOfAppointmentContext) ?? {};
export const useDuplicateContacts = () => useContext(DuplicateContactsContext) ?? {};
export const useCallsHistory = () => useContext(CallsContext);

