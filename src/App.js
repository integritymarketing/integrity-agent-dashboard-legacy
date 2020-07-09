import React, { useState, useContext, createContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import './App.scss';

const AuthContext = createContext();

const AuthenticatedRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({ location }) => (
        auth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      )}
    />
  );
};

const LoginButton = (props) => {
  const history = useHistory();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const login = () => {
    const { from } = location.state || { from: { pathname: "/" } };
    auth.authenticate();
    history.replace(from);
  };

  return (
    <button onClick={login} {...props}></button>
  );
}

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
          <header className="App-header">
            <nav>
              {isAuthenticated ? (
                <ul>
                  <li>
                    <Link to="/" className="link">Home</Link>
                  </li>
                  <li>
                    <Link to="/training" className="link">Training</Link>
                  </li>
                  <li>
                    <button type="button" onClick={() => fakeAuth.signout()} className="link">Sign Out</button>
                  </li>
                </ul>
              ) : (
                <ul>
                  <li>
                    <Link to="/login" className="link">Login</Link>
                  </li>
                </ul>
              )}
            </nav>
          </header>
          <Switch>
            <Route exact path="/login">
              Login Landing <br/>
              <LoginButton className="btn btn--outline">Login</LoginButton>
            </Route>
            <AuthenticatedRoute exact path="/">
              Home
            </AuthenticatedRoute>
            <AuthenticatedRoute path="/training">
              Training
            </AuthenticatedRoute>
            <Route path="*">
              Not Found
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
