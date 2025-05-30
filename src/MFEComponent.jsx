import {AmplitudeProvider} from "providers/AmplitudeProvider";
import {ClientServiceContextProvider} from "services/clientServiceProvider";
import {ThemeProvider} from "@mui/material/styles";
import customTheme from "@/themes/muiTheme";
import CssBaseline from "@mui/material/CssBaseline";
import {RecoilRoot} from "recoil";
import {APIProvider} from "@vis.gl/react-google-maps";
import ToastContextProvider from "components/ui/Toast/ToastContextProvider";
import {ContactListAPIProvider} from "providers/ContactListAPIProviders";
import {StageStatusProvider} from "contexts/stageStatus";
import {CarriersProvider} from "providers/CarriersProvider";
import {AgentPreferencesProvider} from "providers/AgentPreferencesProvider/AgentPreferencesProvider";
import {AgentAccountProvider} from "providers/AgentAccountProvider";
import {CountyProvider} from "contexts/counties";
import {CountyDataProvider} from "providers/CountyDataProvider";
import {ContactMapMarkersDataProvider} from "providers/ContactMapMarkersDataProvider";
import {DeleteLeadProvider} from "contexts/deleteLead";
import {ContactsProvider} from "contexts/contacts";
import {BackNavProvider} from "contexts/backNavProvider";
import {StageSummaryProvider} from "contexts/stageSummary";
import {TaskListProvider} from "contexts/taskListProvider";
import {ProfessionalProfileProvider} from "providers/ProfessionalProfileProvider";
import {CampaignInvitationProvider} from "providers/CampaignInvitation";
import {ContactDetailsProvider} from "providers/ContactDetails";
import {CreateNewQuoteProvider} from "providers/CreateNewQuote";
import {MarketingProvider} from "providers/Marketing";
import {PharmacyProvider} from "providers/PharmacyProvider";
import {ConditionsProvider} from "providers/Life/Conditions/ConditionsProvider";
import {Helmet, HelmetProvider} from "react-helmet-async";
import React, {lazy, Suspense} from "react";
import AppRouter from "components/functional/router";
import AppRoutes from "@/App";
import PortalUrl from "components/functional/portal-url";

const Dashboard = lazy(() => import('pages/dashbaord'));
const HelpPage = lazy(() => import('pages/Help'));
const CampaignDashboardPage = lazy(() =>
  import('pages/Marketing/CampaignDashboard')
);

import './index.scss';
import * as serviceWorker from './serviceWorker';
import Auth0ProviderWithHistory from "auth/Auth0ProviderWithHistory";

const MFEComponent = () => {
  return (
    <React.StrictMode>
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
                                                                        {/*<AppRoutes />*/}
                                                                        <ContactDetailsProvider>
                                                                          <Dashboard />
                                                                        </ContactDetailsProvider>

                                                                        {/*<HelpPage />*/}
                                                                        {/*<CampaignDashboardPage />*/}

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
    </React.StrictMode>
  )
}

export default MFEComponent;


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
