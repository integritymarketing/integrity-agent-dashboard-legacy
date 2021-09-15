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

export const getCookiesMap = (cookiesString) => {
  return cookiesString
    .split(";")
    .map(function (cookieString) {
      return cookieString.trim().split("=");
    })
    .reduce(function (acc, curr) {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});
};
