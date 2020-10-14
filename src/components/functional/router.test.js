import React from "react";
import { Route, Switch } from "react-router-dom";
import { cleanup, screen, render } from "@testing-library/react";

import Router from "./router";

afterEach(cleanup);

test("<Router />", () => {
  render(
    <Router>
      <Switch>
        <Route path="/">
          <h1>index route</h1>
        </Route>
      </Switch>
    </Router>
  );

  expect(screen.getByText(/index route/i)).toBeInTheDocument();
  expect(screen.getByText(/Close message/i)).toBeInTheDocument();
});
