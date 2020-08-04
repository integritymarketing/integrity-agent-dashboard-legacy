import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthAppRoutes from "routes/authApp";

const AuthApp = () => {
  return (
    <Router>
      <div className="content-frame">
        <AuthAppRoutes />
      </div>
    </Router>
  );
};

export default AuthApp;
