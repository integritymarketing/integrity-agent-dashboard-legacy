import * as Sentry from "@sentry/react";
import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "focus-visible";

import AuthClientId from "components/functional/auth/client-id";
import AuthClientUrl from "components/functional/auth/client-url";
import AppRouter from "components/functional/router";
import ToastContextProvider from "components/ui/Toast/ToastContextProvider";

import AuthAppRoutes from "./AuthApp";
import "./index.scss";
import * as serviceWorker from "./serviceWorker";
import { ClientServiceContextProvider } from "services/clientServiceProvider";
import Auth0ProviderWithHistory from "auth/Auth0ProviderWithHistory";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <HelmetProvider>
            <Router>
                <Auth0ProviderWithHistory>
                    <ClientServiceContextProvider>
                        <ToastContextProvider>
                            <Helmet>
                                <title>Integrity</title>
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
                    </ClientServiceContextProvider>
                </Auth0ProviderWithHistory>
            </Router>
        </HelmetProvider>
    </React.StrictMode>
);

// error logging disabled for netlify deploy-preview and branch-deploy builds
// DSN only defined in production apps.  see netlify.toml
if (import.meta.env.VITE_SENTRY_AUTH_DSN) {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_AUTH_DSN,
        environment: import.meta.env.VITE_BUILD_ENV || "Development",
        release: `auth-app@${import.meta.env.VITE_VERSION}`,
    });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
