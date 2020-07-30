import React from "react";
import { Route, Switch } from "react-router-dom";
import DashboardPage from "pages/DashboardPage";
import TrainingPage from "pages/TrainingPage";
import LandingPage from "pages/LandingPage";
import NotFoundPage from "pages/NotFound";
import Logout from "components/auth/logout";
import LogoutCallback from "components/auth/logoutCallback";
import AuthSilentCallback from "components/auth/authSilentCallback";
import AuthCallback from "components/auth/authCallback";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
} from "components/auth/routes";
// TODO: connect to env variable
const EMULATE_REGISTRATION = true;

const RegistrationRoutes = React.lazy(() =>
  import(/* webpackChunkName: 'server-routes' */ "./server")
);

export default () => (
  <Switch>
    <Route
      exact={true}
      path="/signin-oidc-silent"
      component={AuthSilentCallback}
    />
    <Route exact={true} path="/signin-oidc" component={AuthCallback} />
    <Route exact={true} path="/logout" component={Logout} />
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
    {EMULATE_REGISTRATION && (
      <React.Suspense fallback={null}>
        <RegistrationRoutes />
      </React.Suspense>
    )}
    <Route path="*">
      <NotFoundPage />
    </Route>
  </Switch>
);
