import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.scss";
import DashboardPage from "./pages/DashboardPage";
import TrainingPage from "./pages/TrainingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFound";
import AuthContext from "./contexts/auth";

const AuthenticatedRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const fakeAuth = {
    isAuthenticated,
    authenticate: () => setAuthenticated(true),
    signout: () => setAuthenticated(false),
  };

  return (
    <AuthContext.Provider value={fakeAuth}>
      <Router>
        <div className="App">
          <Switch>
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
