import React from "react";
import { Route, Switch } from "react-router-dom";
import DashboardPage from "pages/DashboardPage";
import TrainingPage from "pages/TrainingPage";
import LandingPage from "pages/LandingPage";
import NotFoundPage from "pages/NotFound";
import LogoutCallback from "components/auth/logoutCallback";
import AuthSilentCallback from "components/auth/authSilentCallback";
import AuthCallback from "components/auth/authCallback";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "components/auth/routes";

export default () => (
  <Switch>
    <Route
      exact={true}
      path="/signin-oidc-silent"
      component={AuthSilentCallback}
    />
    <Route exact={true} path="/signin-oidc" component={AuthCallback} />
    <Route exact={true} path="/signout-oidc" component={LogoutCallback} />
    <UnauthenticatedRoute exact path="/">
      <LandingPage />
    </UnauthenticatedRoute>
    <AuthenticatedRoute exact path="/dashboard">
      <DashboardPage />
    </AuthenticatedRoute>
    <AuthenticatedRoute path="/training">
      <TrainingPage />
    </AuthenticatedRoute>
    <Route path="*">
      <NotFoundPage />
    </Route>
  </Switch>
);
