import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "contexts/auth";

function UnProtectedRoute({ redirectPath = "/", children }) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (auth.isAuthenticated()) {
    return <Navigate to={redirectPath} state={{ from: location }} />;
  }

  return children;
}

function ProtectedRoute({ redirectPath = "/", children }) {
  const auth = useContext(AuthContext);
  const location = useLocation();
  
  if (!auth.isAuthenticated()) {
    return <Navigate to={redirectPath} state={{ from: location }} />;
  }

  return children;
}

export { ProtectedRoute, UnProtectedRoute };
