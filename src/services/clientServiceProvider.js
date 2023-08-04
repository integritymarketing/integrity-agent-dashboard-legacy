import React, { useContext, createContext, useMemo } from "react";
import { ClientsService } from "./clientsService";
import { PlansService } from "./plansService";
import { ComparePlansService } from "./comparePlansService";
import { EnrollPlansService } from "./enrollPlansService";
import { useAuth0 } from "@auth0/auth0-react";

const ClientServiceContext = createContext({
  clientsService: null,
  plansService: null,
  comparePlansService: null,
  enrollPlansService: null,
});

export function useClientServiceContext() {
  return useContext(ClientServiceContext);
}

export function ClientServiceContextProvider({ children }) {
  const { getAccessTokenSilently, user } = useAuth0();

  const clientsService = useMemo(
    () => new ClientsService(getAccessTokenSilently),
    [getAccessTokenSilently]
  );

  const plansService = useMemo(
    () => new PlansService(getAccessTokenSilently),
    [getAccessTokenSilently]
  );

  const enrollPlansService = useMemo(
    () => new EnrollPlansService(getAccessTokenSilently),
    [getAccessTokenSilently]
  );

  const comparePlansService = useMemo(
    () => new ComparePlansService(getAccessTokenSilently, user),
    [getAccessTokenSilently, user]
  );

  return (
    <ClientServiceContext.Provider
      value={{ clientsService, plansService, enrollPlansService, comparePlansService }}
    >
      {children}
    </ClientServiceContext.Provider>
  );
}
