import React, { lazy, StrictMode, Suspense, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { ContactDetailsProvider } from "providers/ContactDetails";
import { FinalExpensePlansProvider } from "providers/FinalExpense";
import { ContactsListProvider } from "pages/ContactsList/providers/ContactsListProvider";
import { PharmacyProvider } from "providers/PharmacyProvider";
import { ProductPreferenceDetailsProvider } from "providers/Life/ProductPreferenceDetailsProvider";
import { LifeIulQuoteProvider } from "providers/Life";
import { ConditionsProvider } from "providers/Conditions/ConditionsProvider";

const TrafficDirector = lazy(() => import("components/functional/traffic-director"));
const AddContactPage = lazy(() => import("pages/contacts/AddContactPage"));
const AuthSigninCallback = lazy(() => import("components/functional/auth-signin-callback"));
const AuthSigninRedirectPage = lazy(() => import("pages/auth/SigninRedirectPage"));
const AuthSignoutCallback = lazy(() => import("components/functional/auth-signout-callback"));
const AuthSilentCallback = lazy(() => import("components/functional/auth-silent-callback"));
const ClientImportPage = lazy(() => import("pages/ClientImportPage"));
const ComparePlansPage = lazy(() => import("pages/ComparePlansPage"));
const ComparePlansCodePage = lazy(() => import("pages/ComparePlansCodePage"));
const Dashboard = lazy(() => import("pages/dashbaord"));
const EnrollmentHistoryPage = lazy(() => import("pages/EnrollmentHistoryPage"));
const EnrollmentLinkToContact = lazy(() => import("pages/EnrollmentLinkToContact"));
const ErrorPage = lazy(() => import("pages/ErrorPage"));
const HelpPage = lazy(() => import("pages/Help"));
const MedicareSSORedirect = lazy(() => import("pages/MedicareSSORedirect"));
const LinkToContact = lazy(() => import("pages/LinkToContact"));
const NotFoundPage = lazy(() => import("pages/NotFound"));
const PlanDetailsPage = lazy(() => import("pages/PlanDetailsPage"));
const PlansPage = lazy(() => import("pages/PlansPage"));
const PrivacyPage = lazy(() => import("pages/PrivacyPage"));
const RedirectLoadingPage = lazy(() => import("pages/RedirectLoading"));
const ResourcesPage = lazy(() => import("pages/ResourcesPage"));
const TermsPage = lazy(() => import("pages/TermsPage"));
const WebChatComponent = lazy(() => import("components/WebChat/WebChat"));
const PolicyCodePage = lazy(() => import("pages/dashbaord/SharePolicy"));
const TaskListResultsMobileLayout = lazy(() => import("pages/dashbaord/Tasklist/TaskListResultsMobileLayout"));
const PolicySnapshotMobileLayout = lazy(
    () => import("pages/dashbaord/PolicySnapShot/PolicySnapShotMobileContainer/PolicySnapShotMobileContainer"),
);

const FinalExpensePlansPage = lazy(() => import("pages/FinalExpensePlansPage"));
const SimplifiedIULPlansPage = lazy(() => import("pages/SimplifiedIULPlansPage"));
const FinalExpenseCreateQuotePage = lazy(() => import("pages/FinalExpenseCreateQuotePage"));
const SimplifiedIULCreateQuotePage = lazy(() => import("pages/SimplifiedIULCreateQuotePage"));
const HealthConditionsPage = lazy(() => import("pages/HealthConditionsPage"));
const SimplifiedIULHealthConditionsPage = lazy(() => import("pages/SimplifiedIULHealthConditionsPage"));

const AddZipPage = lazy(() => import("pages/AddZipPage"));
const ContactProfile = lazy(() => import("pages/ContactProfilePage"));
const ContactsList = lazy(() => import("pages/ContactsList"));

const TermsOfUsagePage = lazy(() => import("pages/TermsOfUsagePage"));
const PrivacyPolicyPage = lazy(() => import("pages/PrivacyPolicyPage"));
const CampaignInvitationPage = lazy(() => import("pages/Marketing/CampaignInvitation"));
const CampaignDashboardPage = lazy(() => import("pages/Marketing/CampaignDashboard"));
const ClientConnectMarketingContainer = lazy(() => import("pages/Marketing/ClientConnectMarketing"));

const IulAccumulationConfirmationDetailsPage = lazy(() => import("pages/IulAccumulationConfirmationDetailsPage"));
const IulAccumulationProductPreferencesPage = lazy(() => import("pages/IulAccumulationProductPreferencesPage"));
const IulProtectionConfirmationDetailsPage = lazy(() => import("pages/IulProtectionConfirmationDetailsPage"));
const IulProtectionProductPreferencesPage = lazy(() => import("pages/IulProtectionProductPreferencesPage"));
const TermConfirmationDetailsPage = lazy(() => import("pages/TermConfirmationDetailsPage"));
const TermProductPreferencesPage = lazy(() => import("pages/TermProductPreferencesPage"));
const IulAccumulationQuotePage = lazy(() => import("pages/IulAccumulationQuotePage"));
const IulProtectionQuotePage = lazy(() => import("pages/IulProtectionQuotePage"));
const IulProtectionComparePlansPage = lazy(() => import("pages/IulProtectionComparePlansPage"));
const IulAccumulationQuoteDetailsPage = lazy(() => import("pages/IulAccumulationQuoteDetailsPage"));
const IulProtectionQuoteDetailsPage = lazy(() => import("pages/IulProtectionQuoteDetailsPage"));
const IulAccumulationComparePlansPage = lazy(() => import("pages/IulAccumulationComparePlansPage"));

const ServerLoginPage = lazy(() => import("pages/auth/ServerLoginPage"));
const ServerLogoutPage = lazy(() => import("pages/auth/ServerLogoutPage"));
const ServerErrorPage = lazy(() => import("pages/auth/ServerErrorPage"));
const RegistrationPage = lazy(() => import("pages/auth/RegistrationPage"));
const RegistrationConfirmEmailPage = lazy(() => import("pages/auth/RegistrationConfirmEmailPage"));
const RegistrationConfirmLinkExpiredPage = lazy(() => import("pages/auth/RegistrationConfirmLinkExpiredPage"));
const RegistrationCheckEmailPage = lazy(() => import("pages/auth/RegistrationCheckEmailPage"));
const RegistrationCompletedPage = lazy(() => import("pages/auth/RegistrationCompletedPage"));
const ForgotPasswordPage = lazy(() => import("pages/auth/ForgotPasswordPage"));
const ForgotPasswordSentPage = lazy(() => import("pages/auth/ForgotPasswordSentPage"));
const PasswordResetPage = lazy(() => import("pages/auth/PasswordResetPage"));
const PasswordLinkExpiredPage = lazy(() => import("pages/auth/PasswordLinkExpiredPage"));
const PasswordUpdatedPage = lazy(() => import("pages/auth/PasswordUpdatedPage"));
const FinalErrorPage = lazy(() => import("pages/auth/FinalErrorPage"));
const NewEmailPage = lazy(() => import("pages/auth/NewEmailPage"));
const EmailUpdatedPage = lazy(() => import("pages/auth/EmailUpdatedPage"));
const ContactSupport = lazy(() => import("pages/auth/ContactSupport"));
const ContactSupportInvalidNPN = lazy(() => import("pages/auth/ContactSupportInvalidNPN"));
const UpdateMobileApp = lazy(() => import("pages/auth/UpdateMobileApp"));
const LoginRedirectSSOPage = lazy(() => import("pages/auth/LoginRedirectSSOPage"));

const RedirectAndRestartLoginFlow = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleRedirectAndRestartLoginFlow = () => {
            navigate("/signin");
        };
        handleRedirectAndRestartLoginFlow();
    }, [navigate]);

    return null;
};

const AuthAppRoutes = [
    {
        path: "/login",
        component: (
            <Suspense fallback={<div>Loading...</div>}>
                <ServerLoginPage />
            </Suspense>
        ),
    },
    {
        path: "/logout",
        component: (
            <Suspense fallback={<div>Loading...</div>}>
                <ServerLogoutPage />
            </Suspense>
        ),
    },
    {
        path: "/error",
        component: (
            <Suspense fallback={<div>Loading...</div>}>
                <ServerErrorPage />
            </Suspense>
        ),
    },
    {
        path: "/register",
        component: (
            <Suspense fallback={<div>Loading...</div>}>
                <RegistrationPage />
            </Suspense>
        ),
    },
    {
        path: "/registration-email-sent",
        component: (
            <Suspense fallback={<div>Loading...</div>}>
                <RegistrationCheckEmailPage />
            </Suspense>
        ),
    },
    {
        path: "/confirm-email",
        component: (
            <Suspense fallback={<div>Loading...</div>}>
                <RegistrationConfirmEmailPage />
            </Suspense>
        ),
    },
    {
        path: "/confirm-link-expired",
        component: (
            <Suspense fallback={<div>Loading...</div>}>
                <RegistrationConfirmLinkExpiredPage />
            </Suspense>
        ),
    },
    { path: "/registration-complete", component: <RegistrationCompletedPage /> },
    { path: "/forgot-password", component: <ForgotPasswordPage /> },
    { path: "/password-reset-sent", component: <ForgotPasswordSentPage /> },
    { path: "/reset-password", component: <PasswordResetPage /> },
    { path: "/password-link-expired", component: <PasswordLinkExpiredPage /> },
    { path: "/password-updated", component: <PasswordUpdatedPage /> },
    { path: "/sorry", component: <FinalErrorPage /> },
    { path: "/update-email", component: <NewEmailPage /> },
    { path: "/email-updated", component: <EmailUpdatedPage /> },
    { path: "/contact-support", component: <ContactSupport /> },
    {
        path: "/contact-support-invalid-npn/:npnId",
        component: <ContactSupportInvalidNPN />,
    },
    { path: "/mobile-app-update", component: <UpdateMobileApp /> },
    { path: "/login-redirect-sso", component: <LoginRedirectSSOPage /> },
    {
        path: "*",
        component: RedirectAndRestartLoginFlow,
    },
];

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
        path: "/customer/enrollmenthistory/:contactId/:confirmationNumber/:effectiveDate/:request/:token",
        component: <PolicyCodePage />,
    },
    {
        path: "/customer/plans/:contactId/compare/:planIds/:effectiveDate/:request/:token",
        component: <ComparePlansCodePage />,
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
    { path: "/contact/add-new/:callLogId", component: <AddContactPage /> },
    { path: "/contact/add-new", component: <AddContactPage /> },
    { path: "/contact/new", component: <AddContactPage /> },
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
        path: "/finalexpenses/healthconditions/:contactId",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <ConditionsProvider>
                        <HealthConditionsPage />
                    </ConditionsProvider>
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
        path: "/simplified-iul/create/:contactId",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpensePlansProvider>
                        <SimplifiedIULCreateQuotePage />
                    </FinalExpensePlansProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/simplified-iul/healthconditions/:contactId",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <ConditionsProvider>
                        <SimplifiedIULHealthConditionsPage />
                    </ConditionsProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/simplified-iul/plans/:contactId",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <FinalExpensePlansProvider>
                        <SimplifiedIULPlansPage />
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
        path: "/life/iul-accumulation/:contactId/quote",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <LifeIulQuoteProvider>
                        <IulAccumulationQuotePage />
                    </LifeIulQuoteProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/life/iul-protection/:contactId/quote",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <LifeIulQuoteProvider>
                        <IulProtectionQuotePage />
                    </LifeIulQuoteProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
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
                        <ProductPreferenceDetailsProvider>
                            <IulProtectionProductPreferencesPage />
                        </ProductPreferenceDetailsProvider>
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
    {
        path: "/life/iul-protection/:contactId/:planIds/compare-plans",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <LifeIulQuoteProvider>
                        <IulProtectionComparePlansPage />
                    </LifeIulQuoteProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/life/iul-accumulation/:contactId/:planId/quote-details",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <LifeIulQuoteProvider>
                        <IulAccumulationQuoteDetailsPage />
                    </LifeIulQuoteProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/life/iul-protection/:contactId/:planId/quote-details",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <LifeIulQuoteProvider>
                        <IulProtectionQuoteDetailsPage />
                    </LifeIulQuoteProvider>
                    <WebChatComponent />
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
    {
        path: "/life/iul-accumulation/:contactId/:planIds/compare-plans",
        component: (
            <StrictMode>
                <ContactDetailsProvider>
                    <LifeIulQuoteProvider>
                        <IulAccumulationComparePlansPage />
                    </LifeIulQuoteProvider>
                </ContactDetailsProvider>
            </StrictMode>
        ),
    },
];

export { appRoutes, appProtectedRoutes, AuthAppRoutes };
