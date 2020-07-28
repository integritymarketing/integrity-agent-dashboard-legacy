import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthContext from "contexts/auth";
import authService from "services/auth";

const AppRoutes = React.lazy(() =>
  process.env.REACT_APP_BUILD_TARGET === "server"
    ? import(
        /* webpackChunkName: 'server-routes', webpackMode: "eager" */ "routes/server"
      )
    : import(
        /* webpackChunkName: 'app-routes', webpackMode: "eager" */ "routes/app"
      )
);

const App = () => {
  return (
    <AuthContext.Provider value={authService}>
      <Router>
        <div className="content-frame">
          <Suspense fallback={<div>Loading...</div>}>
            <AppRoutes />
          </Suspense>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
