import React, { lazy, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Media from "react-media";

import {
  UnProtectedRoute,
  ProtectedRoute,
} from "components/functional/auth-routes";
import { appRoutes, appProtectedRoutes } from "routeConfigs/AppRouteConfig";

const LandingPage = lazy(() => import("mobile/landing/LandingPage"));
const MaintenancePage = lazy(() => import("pages/MaintenancePage"));
const Welcome = lazy(() => import("pages/welcome"));

const App = () => {
  const isMaintainanceMode = process.env.REACT_APP_MAINTENANCE_MODE;
  useEffect(() => {
    var iframes = document.querySelectorAll("iframe");
    for (var i = 0; i < iframes.length; i++) {
      iframes[i].parentNode.removeChild(iframes[i]);
    }
  });
  if (isMaintainanceMode) {
    return (
      <Routes>
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="*" element={<Navigate to="/maintenance" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/welcome"
        element={
          <UnProtectedRoute redirectPath="/">
            <Media
              queries={{
                small: "(max-width: 767px)",
              }}
            >
              {(matches) => (matches.small ? <LandingPage /> : <Welcome />)}
            </Media>
          </UnProtectedRoute>
        }
      />
      {appProtectedRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute redirectPath="/">{route.component}</ProtectedRoute>
          }
        />
      ))}
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}
    </Routes>
  );
};

export default App;
