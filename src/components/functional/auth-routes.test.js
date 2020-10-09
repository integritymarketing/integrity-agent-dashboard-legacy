import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { render, cleanup, screen } from "@testing-library/react";
import AuthContext from "contexts/auth";

import { UnauthenticatedRoute, AuthenticatedRoute } from "./auth-routes";

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return render(ui, { wrapper: BrowserRouter });
};

export const TestRouter = ({ user }) => (
  <AuthContext.Provider value={user}>
    <BrowserRouter>
      <Switch>
        <UnauthenticatedRoute path="/unauthenticated">
          <h1>unauthenticated route</h1>
        </UnauthenticatedRoute>
        <AuthenticatedRoute path="/authenticated">
          <h1>authenticated route</h1>
        </AuthenticatedRoute>
        <Route path="/">
          <h1>index route</h1>
        </Route>
      </Switch>
    </BrowserRouter>
  </AuthContext.Provider>
);

afterEach(cleanup);

describe("auth-routes", () => {
  test("<UnauthenticatedRoute />, unauthenticated user should see content", () => {
    const user = { isAuthenticated: jest.fn(() => false) };

    renderWithRouter(<TestRouter user={user} />, {
      route: "/unauthenticated",
    });

    expect(screen.getByText(/unauthenticated route/i)).toBeInTheDocument();
  });

  test("<UnauthenticatedRoute />, authenticated user should be redirected to '/'", () => {
    const user = { isAuthenticated: jest.fn(() => true) };

    renderWithRouter(<TestRouter user={user} />, {
      route: "/unauthenticated",
    });

    expect(screen.getByText(/index route/i)).toBeInTheDocument();
  });

  test("<AuthenticatedRoute />, authenticated user should see content", () => {
    const user = { isAuthenticated: jest.fn(() => true) };

    renderWithRouter(<TestRouter user={user} />, {
      route: "/authenticated",
    });

    expect(screen.getByText(/authenticated route/i)).toBeInTheDocument();
  });

  test("<AuthenticatedRoute />, unauthenticated user should be redirected to '/'", () => {
    const user = { isAuthenticated: jest.fn(() => false) };

    renderWithRouter(<TestRouter user={user} />, {
      route: "/authenticated",
    });

    expect(screen.getByText(/index route/i)).toBeInTheDocument();
  });
});
