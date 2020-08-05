import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AuthContext from "contexts/auth";
import authService from "services/auth";
import AppRoutes from "routes/app";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <AuthContext.Provider value={authService}>
      <Router>
        <ScrollToTop />
        <div className="content-frame">
          <AppRoutes />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
