import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { ThemeProvider } from "@mui/material/styles";
import { Helmet, HelmetProvider } from "react-helmet-async";

import AppRouter from "components/functional/router";
import authService from "services/authService";
import AuthContext from "contexts/auth";
import { theme } from "./theme";
import ToastContextProvider from "components/ui/Toast/ToastContextProvider";
import AuthClientId from "components/functional/auth/client-id";
import AuthClientUrl from "components/functional/auth/client-url";
import AuthAppRoutes from "./AuthApp";
import * as serviceWorker from "./serviceWorker";
import "focus-visible";
import "./index.scss";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <HelmetProvider>
        <AuthContext.Provider value={authService}>
          <ToastContextProvider>
            <Helmet>
              <title>MedicareCENTER</title>
            </Helmet>
            <Suspense fallback={<div>Loading...</div>}>
              <AppRouter>
                <div className="content-frame">
                  <AuthAppRoutes />
                </div>
              </AppRouter>
            </Suspense>
            <AuthClientId />
            <AuthClientUrl />
          </ToastContextProvider>
        </AuthContext.Provider>
      </HelmetProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// error logging disabled for netlify deploy-preview and branch-deploy builds
// DSN only defined in production apps.  see netlify.toml
if (process.env.REACT_APP_SENTRY_AUTH_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_AUTH_DSN,
    environment: process.env.REACT_APP_BUILD_ENV || "Development",
    release: "auth-app@" + process.env.REACT_APP_VERSION,
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
