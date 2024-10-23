import * as Sentry from "@sentry/react";
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ParallaxProvider } from "react-scroll-parallax";
import { BrowserRouter as Router } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import "focus-visible";
import { AgentAccountProvider } from "providers/AgentAccountProvider/AgentAccountProvider";
import { RecoilRoot } from "recoil";
import { AgentPreferencesProvider } from "providers/AgentPreferencesProvider/AgentPreferencesProvider";
import PortalUrl from "components/functional/portal-url";
import AppRouter from "components/functional/router";
import ToastContextProvider from "components/ui/Toast/ToastContextProvider";

import { BackNavProvider } from "contexts/backNavProvider";
import { ContactsProvider } from "contexts/contacts";
import { CountyProvider } from "contexts/counties";
import { DeleteLeadProvider } from "contexts/deleteLead";
import { StageSummaryProvider } from "contexts/stageSummary";
import { TaskListProvider } from "contexts/taskListProvider";
import { CampaignInvitationProvider } from "providers/CampaignInvitation";
import { ProfessionalProfileProvider } from "providers/ProfessionalProfileProvider";
import { CreateNewQuoteProvider } from "providers/CreateNewQuote";
import { ContactDetailsProvider } from "providers/ContactDetails";
import { MarketingProvider } from "providers/Marketing";
import { CountyDataProvider } from "providers/CountyDataProvider";
import { StageStatusProvider } from "contexts/stageStatus";
import { PharmacyProvider } from "providers/PharmacyProvider";
import AppRoutes from "./App";
import "./index.scss";
import * as serviceWorker from "./serviceWorker";
import customTheme from "./themes/muiTheme";
import { ClientServiceContextProvider } from "services/clientServiceProvider";
import Auth0ProviderWithHistory from "auth/Auth0ProviderWithHistory";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ContactMapMarkersDataProvider } from "providers/ContactMapMarkersDataProvider";

// error logging disabled for netlify deploy-preview and branch-deploy builds
// DSN only defined in production apps.  see netlify.toml
if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        environment: process.env.REACT_APP_BUILD_ENV || "Development",
        release: `portal-app@${process.env.REACT_APP_VERSION}`,
    });
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <ParallaxProvider>
            <Router>
                <Auth0ProviderWithHistory>
                    <ClientServiceContextProvider>
                        <ThemeProvider theme={customTheme}>
                            <CssBaseline />
                            <RecoilRoot>
                                <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                                    <ToastContextProvider>
                                        <StageStatusProvider>
                                            <AgentPreferencesProvider>
                                                <AgentAccountProvider>
                                                    <CountyProvider>
                                                        <CountyDataProvider>
                                                            <ContactMapMarkersDataProvider>
                                                                <DeleteLeadProvider>
                                                                    <ContactsProvider>
                                                                        <BackNavProvider>
                                                                            <StageSummaryProvider>
                                                                                <TaskListProvider>
                                                                                    <CampaignInvitationProvider>
                                                                                        <ProfessionalProfileProvider>
                                                                                            <ContactDetailsProvider>
                                                                                                <CreateNewQuoteProvider>
                                                                                                    <MarketingProvider>
                                                                                                        <PharmacyProvider>
                                                                                                            <HelmetProvider>
                                                                                                                <Helmet>
                                                                                                                    <title>
                                                                                                                        Integrity
                                                                                                                    </title>
                                                                                                                </Helmet>
                                                                                                                <Suspense
                                                                                                                    fallback={
                                                                                                                        <div>
                                                                                                                            Loading...
                                                                                                                        </div>
                                                                                                                    }
                                                                                                                >
                                                                                                                    <AppRouter>
                                                                                                                        <div className="content-frame">
                                                                                                                            <AppRoutes />
                                                                                                                        </div>
                                                                                                                    </AppRouter>
                                                                                                                </Suspense>
                                                                                                                <PortalUrl />
                                                                                                            </HelmetProvider>
                                                                                                        </PharmacyProvider>
                                                                                                    </MarketingProvider>
                                                                                                </CreateNewQuoteProvider>
                                                                                            </ContactDetailsProvider>
                                                                                        </ProfessionalProfileProvider>
                                                                                    </CampaignInvitationProvider>
                                                                                </TaskListProvider>
                                                                            </StageSummaryProvider>
                                                                        </BackNavProvider>
                                                                    </ContactsProvider>
                                                                </DeleteLeadProvider>
                                                            </ContactMapMarkersDataProvider>
                                                        </CountyDataProvider>
                                                    </CountyProvider>
                                                </AgentAccountProvider>
                                            </AgentPreferencesProvider>
                                        </StageStatusProvider>
                                    </ToastContextProvider>
                                </APIProvider>
                            </RecoilRoot>
                        </ThemeProvider>
                    </ClientServiceContextProvider>
                </Auth0ProviderWithHistory>
            </Router>
        </ParallaxProvider>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
