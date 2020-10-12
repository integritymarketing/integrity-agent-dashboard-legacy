import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { render } from "@testing-library/react";
import AuthContext from "contexts/auth";

export const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return render(ui, { wrapper: BrowserRouter });
};

export const TestRouterWithAuth = ({ mockAuthService, children }) => (
  <AuthContext.Provider value={mockAuthService}>
    <BrowserRouter>
      <Switch>{children}</Switch>
    </BrowserRouter>
  </AuthContext.Provider>
);
