import React, { useContext, createContext, useMemo } from "react";
import { ClientsService } from "./clientsService";
import { useAuth0 } from "@auth0/auth0-react";

const ClientServiceContext = createContext({
  clientsService: null,
});

export function useClientServiceContext() {
  return useContext(ClientServiceContext);
}

export function ClientServiceContextProvider({ children }) {
  const { getAccessTokenSilently } = useAuth0();

  const clientsService = useMemo(() => new ClientsService(getAccessTokenSilently), [getAccessTokenSilently]);

  return (
    <ClientServiceContext.Provider value={{ clientsService }}>
      {children}
    </ClientServiceContext.Provider>
  );
}
