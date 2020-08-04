import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthContext from "contexts/auth";
import authService from "services/auth";
import AppRoutes from "routes/app";

const App = () => {
  return (
    <AuthContext.Provider value={authService}>
      <Router>
        <div className="content-frame">
          <AppRoutes />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
