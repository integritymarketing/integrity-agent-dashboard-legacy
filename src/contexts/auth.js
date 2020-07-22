import { createContext } from "react";

export default createContext({
  isAuthenticated: () => {
    return false;
  },
  signinRedirectCallback: () => ({}),
  logout: () => ({}),
  signoutRedirectCallback: () => ({}),
  signinRedirect: () => ({}),
  signinSilentCallback: () => ({}),
  createSigninRequest: () => ({}),
});
