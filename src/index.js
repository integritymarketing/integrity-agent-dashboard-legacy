import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import * as Sentry from "@sentry/react";
import { RecoilRoot } from "recoil";
import { ParallaxProvider } from "react-scroll-parallax";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { BackNavProvider } from "contexts/backNavProvider";
import { ContactsProvider } from "contexts/contacts";
import { CountyProvider } from "contexts/counties";
import { DeleteLeadProvider } from "contexts/deleteLead";
import { StageSummaryProvider } from "contexts/stageSummary";
import ToastContextProvider from "components/ui/Toast/ToastContextProvider";
import { LifeProvider } from "contexts/Life";
import { FinalExpensePlansProvider } from "providers/FinalExpense";

import AuthContext from "contexts/auth";
import authService from "services/authService";
import AppRouter from "components/functional/router";
import AppRoutes from "./App";
import PortalUrl from "components/functional/portal-url";
import * as serviceWorker from "./serviceWorker";
import { theme } from "./theme";
import "focus-visible";
import "./index.scss";

// error logging disabled for netlify deploy-preview and branch-deploy builds
// DSN only defined in production apps.  see netlify.toml
if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_BUILD_ENV || "Development",
    release: "portal-app@" + process.env.REACT_APP_VERSION,
  });
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ParallaxProvider>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={authService}>
          <CssBaseline />
          <RecoilRoot>
            <ToastContextProvider>
              <CountyProvider>
                <DeleteLeadProvider>
                  <ContactsProvider>
                    <BackNavProvider>
                      <StageSummaryProvider>
                        <LifeProvider>
                          <FinalExpensePlansProvider>
                            <HelmetProvider>
                              <Helmet>
                                <title>MedicareCENTER</title>
                              </Helmet>
                              <Suspense fallback={<div>Loading...</div>}>
                                <AppRouter>
                                  <div className="content-frame">
                                    <AppRoutes />
                                  </div>
                                </AppRouter>
                              </Suspense>
                              <PortalUrl />
                            </HelmetProvider>
                          </FinalExpensePlansProvider>
                        </LifeProvider>
                      </StageSummaryProvider>
                    </BackNavProvider>
                  </ContactsProvider>
                </DeleteLeadProvider>
              </CountyProvider>
            </ToastContextProvider>
          </RecoilRoot>
        </AuthContext.Provider>
      </ThemeProvider>
    </ParallaxProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
