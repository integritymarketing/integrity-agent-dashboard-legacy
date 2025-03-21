import * as Sentry from '@sentry/react';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ParallaxProvider } from 'react-scroll-parallax';
import { BrowserRouter as Router } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import 'focus-visible';
import { AgentAccountProvider } from 'providers/AgentAccountProvider/AgentAccountProvider';
import { RecoilRoot } from 'recoil';
import { AgentPreferencesProvider } from 'providers/AgentPreferencesProvider/AgentPreferencesProvider';
import PortalUrl from 'components/functional/portal-url';
import AppRouter from 'components/functional/router';
import ToastContextProvider from 'components/ui/Toast/ToastContextProvider';

import { BackNavProvider } from 'contexts/backNavProvider';
import { ContactsProvider } from 'contexts/contacts';
import { CountyProvider } from 'contexts/counties';
import { DeleteLeadProvider } from 'contexts/deleteLead';
import { StageSummaryProvider } from 'contexts/stageSummary';
import { TaskListProvider } from 'contexts/taskListProvider';
import { CampaignInvitationProvider } from 'providers/CampaignInvitation';
import { ProfessionalProfileProvider } from 'providers/ProfessionalProfileProvider';
import { CreateNewQuoteProvider } from 'providers/CreateNewQuote';
import { ContactDetailsProvider } from 'providers/ContactDetails';
import { MarketingProvider } from 'providers/Marketing';
import { CountyDataProvider } from 'providers/CountyDataProvider';
import { StageStatusProvider } from 'contexts/stageStatus';
import { PharmacyProvider } from 'providers/PharmacyProvider';
import AppRoutes from './App';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import customTheme from './themes/muiTheme';
import { ClientServiceContextProvider } from 'services/clientServiceProvider';
import Auth0ProviderWithHistory from 'auth/Auth0ProviderWithHistory';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ContactMapMarkersDataProvider } from 'providers/ContactMapMarkersDataProvider';
import { ConditionsProvider } from 'providers/Life/Conditions/ConditionsProvider';
import { AmplitudeProvider } from 'providers/AmplitudeProvider';
import { ContactListAPIProvider } from 'providers/ContactListAPIProviders';
import { CarriersProvider } from 'providers/CarriersProvider';
// error logging disabled for netlify deploy-preview and branch-deploy builds
// DSN only defined in production apps.  see netlify.toml
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_BUILD_ENV || 'Development',
    release: `portal-app@${import.meta.env.VITE_VERSION}`,
  });
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ParallaxProvider>
      <Router>
        <Auth0ProviderWithHistory>
          <AmplitudeProvider>
            <ClientServiceContextProvider>
              <ThemeProvider theme={customTheme}>
                <CssBaseline />
                <RecoilRoot>
                  <APIProvider
                    apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  >
                    <ToastContextProvider>
                      <ContactListAPIProvider>
                        <StageStatusProvider>
                          <CarriersProvider>
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
                                                <ProfessionalProfileProvider>
                                                  <CampaignInvitationProvider>
                                                    <ContactDetailsProvider>
                                                      <CreateNewQuoteProvider>
                                                        <MarketingProvider>
                                                          <PharmacyProvider>
                                                            <ConditionsProvider>
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
                                                                    <div className='content-frame'>
                                                                      <AppRoutes />
                                                                    </div>
                                                                  </AppRouter>
                                                                </Suspense>
                                                                <PortalUrl />
                                                              </HelmetProvider>
                                                            </ConditionsProvider>
                                                          </PharmacyProvider>
                                                        </MarketingProvider>
                                                      </CreateNewQuoteProvider>
                                                    </ContactDetailsProvider>
                                                  </CampaignInvitationProvider>
                                                </ProfessionalProfileProvider>
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
                          </CarriersProvider>
                        </StageStatusProvider>
                      </ContactListAPIProvider>
                    </ToastContextProvider>
                  </APIProvider>
                </RecoilRoot>
              </ThemeProvider>
            </ClientServiceContextProvider>
          </AmplitudeProvider>
        </Auth0ProviderWithHistory>
      </Router>
    </ParallaxProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
