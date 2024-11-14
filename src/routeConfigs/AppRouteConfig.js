import { StrictMode, lazy } from "react";
import { Navigate } from "react-router-dom";

import { ContactDetailsProvider } from "providers/ContactDetails";
import { FinalExpensePlansProvider } from "providers/FinalExpense";
import { ContactsListProvider } from "pages/ContactsList/providers/ContactsListProvider";
import { PharmacyProvider } from "providers/PharmacyProvider";
import { ProductPreferenceDetailsProvider } from "providers/Life/ProductPreferenceDetailsProvider";

const TrafficDirector = lazy(() => import("components/functional/traffic-director"));
const AccountPage = lazy(() => import("pages/Account/AccountPage"));
const AddNewContactPage = lazy(() => import("pages/contacts/AddNewContactPage"));
const AuthSigninCallback = lazy(() => import("components/functional/auth-signin-callback"));
const AuthSigninRedirectPage = lazy(() => import("pages/auth/SigninRedirectPage"));
const AuthSignoutCallback = lazy(() => import("components/functional/auth-signout-callback"));
const AuthSilentCallback = lazy(() => import("components/functional/auth-silent-callback"));
const ClientImportPage = lazy(() => import("pages/ClientImportPage"));
const ComparePlansPage = lazy(() => import("pages/ComparePlansPage"));
const ComparePlansCodePage = lazy(() => import("pages/ComparePlansCodePage"));
const ContactsSOAConfirmForm = lazy(() => import("pages/contacts/soa/ContactsSOAConfirmForm"));
const Dashboard = lazy(() => import("pages/dashbaord"));
const EnrollmentHistoryPage = lazy(() => import("pages/EnrollmentHistoryPage"));
const EnrollmentLinkToContact = lazy(() => import("pages/EnrollmentLinkToContact"));
const ErrorPage = lazy(() => import("pages/ErrorPage"));
const HelpPage = lazy(() => import("pages/Help"));
const MedicareSSORedirect = lazy(() => import("pages/MedicareSSORedirect"));
const LinkToContact = lazy(() => import("pages/LinkToContact"));
const NewScopeOfAppointment = lazy(() => import("pages/contacts/contactRecordInfo/newScopeOfAppointment"));
const NotFoundPage = lazy(() => import("pages/NotFound"));
const PlanDetailsPage = lazy(() => import("pages/PlanDetailsPage"));
const PlansPage = lazy(() => import("pages/PlansPage"));
const PrivacyPage = lazy(() => import("pages/PrivacyPage"));
const RedirectLoadingPage = lazy(() => import("pages/RedirectLoading"));
const ResourcesPage = lazy(() => import("pages/ResourcesPage"));
const SOAConfirmationForm = lazy(() => import("pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation"));
const SOAConfirmationPage = lazy(
    () => import("pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation/ConfirmationPage"),
);
const TermsPage = lazy(() => import("pages/TermsPage"));
const WebChatComponent = lazy(() => import("components/WebChat/WebChat"));
const PolicyCodePage = lazy(() => import("pages/dashbaord/SharePolicy"));
const TaskListResultsMobileLayout = lazy(() => import("pages/dashbaord/Tasklist/TaskListResultsMobileLayout"));
const PolicySnapshotMobileLayout = lazy(
    () => import("pages/dashbaord/PolicySnapShot/PolicySnapShotMobileContainer/PolicySnapShotMobileContainer"),
);

const FinalExpensePlansPage = lazy(() => import("pages/FinalExpensePlansPage"));
const FinalExpenseCreateQuotePage = lazy(() => import("pages/FinalExpenseCreateQuotePage"));
const FinalExpenseHealthConditionsPage = lazy(() => import("pages/FinalExpenseHealthConditionsPage"));

const AddZipPage = lazy(() => import("pages/AddZipPage"));
const ContactProfile = lazy(() => import("pages/ContactProfilePage"));
const ContactsList = lazy(() => import("pages/ContactsList"));

const TermsOfUsagePage = lazy(() => import("pages/TermsOfUsagePage"));
const PrivacyPolicyPage = lazy(() => import("pages/PrivacyPolicyPage"));
const LoginRedirectSSOPage = lazy(() => import("pages/auth/LoginRedirectSSOPage"));
const CampaignInvitationPage = lazy(() => import("pages/Marketing/CampaignInvitation"));
const CampaignDashboardPage = lazy(() => import("pages/Marketing/CampaignDashboard"));
const ClientConnectMarketingContainer = lazy(() => import("pages/Marketing/ClientConnectMarketing"));

const IulAccumulationConfirmationDetailsPage = lazy(() => import("pages/IulAccumulationConfirmationDetailsPage"));
const IulAccumulationProductPreferencesPage = lazy(() => import("pages/IulAccumulationProductPreferencesPage"));
const IulProtectionConfirmationDetailsPage = lazy(() => import("pages/IulProtectionConfirmationDetailsPage"));
const IulProtectionProductPreferencesPage = lazy(() => import("pages/IulProtectionProductPreferencesPage"));
const TermConfirmationDetailsPage = lazy(() => import("pages/TermConfirmationDetailsPage"));
const TermProductPreferencesPage = lazy(() => import("pages/TermProductPreferencesPage"));

const appRoutes = [
    {
        path: "/",
        component: <TrafficDirector />,
    },
    { path: "/terms", component: <TermsPage /> },
    { path: "/privacy", component: <PrivacyPage /> },
    { path: "/terms-of-usage", component: <TermsOfUsagePage /> },
    { path: "/privacy-policy", component: <PrivacyPolicyPage /> },
    {
        path: "/soa-confirmation-form/:linkCode/:token",
        component: <SOAConfirmationForm />,
    },
    {
        path: "/customer/enrollmenthistory/:contactId/:confirmationNumber/:effectiveDate/:request/:token",
        component: <PolicyCodePage />,
    },
    {
        path: "/customer/plans/:contactId/compare/:planIds/:effectiveDate/:request/:token",
        component: <ComparePlansCodePage />,
    },
    {
        path: "/soa-confirmation-page/:firstName/:lastName",
        component: <SOAConfirmationPage />,
    },
    { path: "/signin", component: <AuthSigninRedirectPage /> },
    {
        path: "/signin-oidc-silent",
        component: <AuthSilentCallback />,
    },
    { path: "/signin-oidc", component: <AuthSigninCallback /> },
    {
        path: "/signin-oidc-sunfire-mobile",
        component: <AuthSigninCallback />,
    },
    { path: "/signout-oidc", component: <AuthSignoutCallback /> },
    { path: "/maintenance", component: <Navigate to="/" /> },
    { path: "/clients", component: <Navigate to="/contacts" /> },
    { path: "/error", component: <ErrorPage /> },
    { path: "/clientsSSO", component: <MedicareSSORedirect /> },
    { path: "/login-redirect-sso", component: <LoginRedirectSSOPage /> },
    { path: "*", component: <NotFoundPage /> },
];

const appProtectedRoutes = [
    {
        path: "/redirect-loading",
        component: <RedirectLoadingPage />,
    },
    {
        path: "/home",
        component: <Dashboard />,
    },
    {
        path: "/dashboard",
        component: (
            <ContactDetailsProvider>
                <Dashboard />
                <WebChatComponent />
            </ContactDetailsProvider>
        ),
    },
    {
        path: "/link-to-contact/*",
        component: <LinkToContact />,
    },
    {
        path: "/enrollmenthistory/:contactId/:confirmationNumber/:effectiveDate",
        component: (
            <ContactDetailsProvider>
                <EnrollmentHistoryPage />
            </ContactDetailsProvider>
        ),
    },
    {
        path: "/enrollment-link-to-contact",
        component: (
            <ContactDetailsProvider>
                <EnrollmentLinkToContact />
            </ContactDetailsProvider>
        ),
    },
    { path: "/account", component: <AccountPage /> },
    { path: "/account/:section/", component: <AccountPage /> },
    { path: "/help", component: <HelpPage /> },
    { path: "/learning-center", component: <ResourcesPage /> },
    {
        path: "/contacts/*",
        component: (
            <>
                <ContactsList />
                <WebChatComponent />
            </>
        ),
    },
    { path: "/contact/add-new/:callLogId", component: <AddNewContactPage /> },
    { path: "/contact/add-new", component: <AddNewContactPage /> },
    {
        path: "/contact/:leadId/duplicate/:duplicateLeadId",
        component: (
            <>
                <ContactDetailsProvider>
                    <ContactProfile />
                </ContactDetailsProvider>
            </>
        ),
    },
    {
        path: "/contact/:leadId",
        component: (
            <>
                <ContactDetailsProvider>
                    <ContactProfile />
                </ContactDetailsProvider>
            </>
        ),
    },
    {
        path: "/contact/:leadId/:sectionId",
        component: (
            <>
                <ContactDetailsProvider>
                    <ContactProfile />
                </ContactDetailsProvider>
            </>
        ),
    },
    { path: "/new-soa/:leadId", component: <NewScopeOfAppointment /> },
    {
        path: "/contact/:contactId/soa-confirm/:linkCode",
        component: <ContactsSOAConfirmForm />,
    },
    { path: "/client-import", component: <ClientImportPage /> },
    {
        path: "/plans/:contactId/compare/:planIds/:effectiveDate",
        component: (
            <ContactDetailsProvider>
                <PharmacyProvider>
                    <ComparePlansPage />
                </PharmacyProvider>
            </ContactDetailsProvider>
        ),
    },
    {
        path: "/plans/:contactId",
        component: (
            <ContactDetailsProvider>
                <PharmacyProvider>
                    <PlansPage />
                </PharmacyProvider>
            </ContactDetailsProvider>
        ),
    },
    {
        path: "/:contactId/plan/:planId/:effectiveDate",
        component: (
            <ContactDetailsProvider>
                <PharmacyProvider>
                    <PlanDetailsPage />
                </PharmacyProvider>
            </ContactDetailsProvider>
        ),
    },
    {
        path: "/finalexpenses/create/:contactId",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpensePlansProvider>
                        <FinalExpenseCreateQuotePage />
                    </FinalExpensePlansProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/finalexpenses/healthconditions/:contactId",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpenseHealthConditionsPage />
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/finalexpenses/plans/:contactId",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpensePlansProvider>
                        <FinalExpensePlansPage />
                    </FinalExpensePlansProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/contact/:contactId/addZip",
        component: (
            <ContactDetailsProvider>
                <AddZipPage />
            </ContactDetailsProvider>
        ),
    },
    {
        path: "taskList-results-mobile-layout/:npn/:widget",
        component: (
            <ContactDetailsProvider>
                <TaskListResultsMobileLayout />
                <WebChatComponent />
            </ContactDetailsProvider>
        ),
    },
    {
        path: "policy-snapshot-mobile-layout/:npn",
        component: (
            <ContactDetailsProvider>
                <PolicySnapshotMobileLayout />
                <WebChatComponent />
            </ContactDetailsProvider>
        ),
    },
    {
        path: "marketing/campaign-details/:campaignId",
        component: (
            <ContactsListProvider>
                <CampaignInvitationPage />
            </ContactsListProvider>
        ),
    },
    {
        path: "marketing/campaign-dashboard",
        component: <CampaignDashboardPage />,
    },
    {
        path: "marketing/client-connect-marketing",
        component: <ClientConnectMarketingContainer />,
    },
    {
        path: "/life/iul-accumulation/:contactId/confirm-details",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpensePlansProvider>
                        <IulAccumulationConfirmationDetailsPage />
                    </FinalExpensePlansProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/life/iul-accumulation/:contactId/product-preferences",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpensePlansProvider>
                        <ProductPreferenceDetailsProvider>
                            <IulAccumulationProductPreferencesPage />
                        </ProductPreferenceDetailsProvider>
                    </FinalExpensePlansProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/life/iul-protection/:contactId/confirm-details",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpensePlansProvider>
                        <IulProtectionConfirmationDetailsPage />
                    </FinalExpensePlansProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/life/iul-protection/:contactId/product-preferences",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpensePlansProvider>
                        <IulProtectionProductPreferencesPage />
                    </FinalExpensePlansProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/life/term/:contactId/confirm-details",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpensePlansProvider>
                        <TermConfirmationDetailsPage />
                    </FinalExpensePlansProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/life/term/:contactId/product-preferences",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpensePlansProvider>
                        <TermProductPreferencesPage />
                    </FinalExpensePlansProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
];

export { appRoutes, appProtectedRoutes };
