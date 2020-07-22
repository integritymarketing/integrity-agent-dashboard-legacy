import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import DashboardPage from "pages/DashboardPage";
import TrainingPage from "pages/TrainingPage";
import LoginPage from "pages/LoginPage";
import NotFoundPage from "pages/NotFound";
import AuthContext from "contexts/auth";
import Logout from "components/auth/logout";
import LogoutCallback from "components/auth/logoutCallback";
import AuthCallback from "components/auth/authCallback";
import AuthService from "services/auth";
import AuthenticatedRoute from "components/auth/authenticatedRoute";

const App = () => {
  return (
    <AuthContext.Provider value={new AuthService()}>
      <Router>
        <div className="App">
          <Switch>
            <Route exact={true} path="/signin-oidc" component={AuthCallback} />
            <Route exact={true} path="/logout" component={Logout} />
            <Route
              exact={true}
              path="/signout-oidc"
              component={LogoutCallback}
            />
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <AuthenticatedRoute exact path="/">
              <DashboardPage />
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/training">
              <TrainingPage />
            </AuthenticatedRoute>
            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
