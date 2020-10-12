import React from "react";
import { Route } from "react-router-dom";
import { cleanup, screen } from "@testing-library/react";

import { UnauthenticatedRoute, AuthenticatedRoute } from "./auth-routes";

import { TestRouterWithAuth, renderWithRouter } from "utils/testing";

export const MyTestRouter = ({ user }) => (
  <TestRouterWithAuth mockAuthService={user}>
    <UnauthenticatedRoute path="/unauthenticated">
      <h1>unauthenticated route</h1>
    </UnauthenticatedRoute>
    <AuthenticatedRoute path="/authenticated">
      <h1>authenticated route</h1>
    </AuthenticatedRoute>
    <Route path="/">
      <h1>index route</h1>
    </Route>
  </TestRouterWithAuth>
);

afterEach(cleanup);

test("<UnauthenticatedRoute />, unauthenticated user should see content", () => {
  const user = { isAuthenticated: jest.fn(() => false) };

  renderWithRouter(<MyTestRouter user={user} />, {
    route: "/unauthenticated",
  });

  expect(screen.getByText(/unauthenticated route/i)).toBeInTheDocument();
});

test("<UnauthenticatedRoute />, authenticated user should be redirected to '/'", () => {
  const user = { isAuthenticated: jest.fn(() => true) };

  renderWithRouter(<MyTestRouter user={user} />, {
    route: "/unauthenticated",
  });

  expect(screen.getByText(/index route/i)).toBeInTheDocument();
});

test("<AuthenticatedRoute />, authenticated user should see content", () => {
  const user = { isAuthenticated: jest.fn(() => true) };

  renderWithRouter(<MyTestRouter user={user} />, {
    route: "/authenticated",
  });

  expect(screen.getByText(/authenticated route/i)).toBeInTheDocument();
});

test("<AuthenticatedRoute />, unauthenticated user should be redirected to '/'", () => {
  const user = { isAuthenticated: jest.fn(() => false) };

  renderWithRouter(<MyTestRouter user={user} />, {
    route: "/authenticated",
  });

  expect(screen.getByText(/index route/i)).toBeInTheDocument();
});
