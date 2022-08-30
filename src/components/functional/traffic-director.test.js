import React from "react";
import { Route } from "react-router-dom";
import { cleanup, screen } from "@testing-library/react";

import TrafficDirector from "./traffic-director";

import { renderWithRouter, TestRouterWithAuth } from "utils/testing";

afterEach(cleanup);

const myTestRouter = (mockAuthService) =>
  renderWithRouter(
    <TestRouterWithAuth mockAuthService={mockAuthService}>
      <Route exact path="/">
        <TrafficDirector />
      </Route>
      <Route path="/dashboard" component={() => <h1>dashbaord route</h1>} />
      <Route path="/welcome" component={() => <h1>welcome route</h1>} />
    </TestRouterWithAuth>,
    {
      route: "/",
    }
  );

test("<TrafficDirector />, directs unauthenticated traffic to welcome route", () => {
  const mockAuthService = { isAuthenticated: jest.fn(() => false) };

  myTestRouter(mockAuthService);

  expect(screen.getByText(/welcome route/i)).toBeInTheDocument();
});
