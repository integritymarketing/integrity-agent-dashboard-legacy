import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AuthAppRoutes from "routes/authApp";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AuthApp = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="content-frame">
        <AuthAppRoutes />
      </div>
    </Router>
  );
};

export default AuthApp;
