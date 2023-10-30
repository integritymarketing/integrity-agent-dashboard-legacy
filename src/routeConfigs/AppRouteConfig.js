import { lazy } from "react";
import { Navigate } from "react-router-dom";

const TrafficDirector = lazy(() =>
  import("components/functional/traffic-director")
);
const AccountPage = lazy(() => import("pages/AccountPage"));
const AddNewContactPage = lazy(() =>
  import("pages/contacts/AddNewContactPage")
);
const AuthSigninCallback = lazy(() =>
  import("components/functional/auth-signin-callback")
);
const AuthSigninRedirectPage = lazy(() =>
  import("pages/auth/SigninRedirectPage")
);
const AuthSignoutCallback = lazy(() =>
  import("components/functional/auth-signout-callback")
);
const AuthSilentCallback = lazy(() =>
  import("components/functional/auth-silent-callback")
);
const ClientImportPage = lazy(() => import("pages/ClientImportPage"));
const ComparePlansPage = lazy(() => import("pages/ComparePlansPage"));
const ContactDetailsPage = lazy(() => import("pages/ContactDetails"));
const ContactRecordInfo = lazy(() =>
  import("pages/contacts/contactRecordInfo")
);
const ComparePlansCodePage = lazy(() => import("pages/ComparePlansCodePage"));
const ContactsPage = lazy(() => import("pages/contacts/ContactsPage"));
const ContactsSOAConfirmForm = lazy(() =>
  import("pages/contacts/soa/ContactsSOAConfirmForm")
);
const Dashboard = lazy(() => import("pages/dashbaord"));
const EnrollmentHistoryPage = lazy(() => import("pages/EnrollmentHistoryPage"));
const EnrollmentLinkToContact = lazy(() =>
  import("pages/EnrollmentLinkToContact")
);
const ErrorPage = lazy(() => import("pages/ErrorPage"));
const HelpPage = lazy(() => import("pages/Help"));
const LeadCenterRedirect = lazy(() => import("pages/LeadCenterRedirect"));
const LinkToContact = lazy(() => import("pages/LinkToContact"));
const NewScopeOfAppointment = lazy(() =>
  import("pages/contacts/contactRecordInfo/newScopeOfAppointment")
);
const NotFoundPage = lazy(() => import("pages/NotFound"));
const PlanDetailsPage = lazy(() => import("pages/PlanDetailsPage"));
const PlansPage = lazy(() => import("pages/PlansPage"));
const FinalExpensesPage = lazy(() => import("pages/FinalExpensesPage"));
const PlanOptionsPage = lazy(() => import("pages/PlanOptionsPage"));
const PrivacyPage = lazy(() => import("pages/PrivacyPage"));
const RedirectLoadingPage = lazy(() => import("pages/RedirectLoading"));
const ResourcesPage = lazy(() => import("pages/ResourcesPage"));
const SOAConfirmationForm = lazy(() =>
  import("pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation")
);
const SOAConfirmationPage = lazy(() =>
  import(
    "pages/contacts/contactRecordInfo/scopeOfAppointmentConfirmation/ConfirmationPage"
  )
);
const TermsPage = lazy(() => import("pages/TermsPage"));
const WebChatComponent = lazy(() => import("components/WebChat/WebChat"));
const PolicyCodePage = lazy(() => import("pages/dashbaord/SharePolicy"));

const appRoutes = [
  {
    path: "/",
    component: <TrafficDirector />,
  },
  { path: "/terms", component: <TermsPage /> },
  { path: "/privacy", component: <PrivacyPage /> },
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
      <>
        <Dashboard />
        <WebChatComponent />
      </>
    ),
  },
  {
    path: "/link-to-contact/:callLogId/:callFrom/:duration/:date",
    component: <LinkToContact />,
  },
  {
    path: "/enrollmenthistory/:contactId/:confirmationNumber/:effectiveDate",
    component: <EnrollmentHistoryPage />,
  },
  {
    path: "/enrollment-link-to-contact",
    component: <EnrollmentLinkToContact />,
  },
  { path: "/account", component: <AccountPage /> },
  { path: "/help", component: <HelpPage /> },
  { path: "/learning-center", component: <ResourcesPage /> },
  { path: "/contacts/*", component: <ContactsPage /> },
  { path: "/contact/add-new/:callLogId", component: <AddNewContactPage /> },
  { path: "/contact/add-new", component: <AddNewContactPage /> },
  {
    path: "/contact/:contactId/duplicate/:duplicateLeadId",
    component: <ContactRecordInfo />,
  },
  {
    path: "/contact/:contactId",
    component: <ContactRecordInfo />,
  },
  {
    path: "/contact/:contactId/:sectionId",
    component: <ContactRecordInfo />,
  },
  {
    path: "/new/contact/:contactId",
    component: <ContactDetailsPage />,
  },
  { path: "/new-soa/:leadId", component: <NewScopeOfAppointment /> },
  {
    path: "/contact/:contactId/soa-confirm/:linkCode",
    component: <ContactsSOAConfirmForm />,
  },
  { path: "/leadcenter-redirect/:npn", component: <LeadCenterRedirect /> },
  { path: "/client-import", component: <ClientImportPage /> },
  {
    path: "/plans/:contactId/compare/:planIds/:effectiveDate",
    component: <ComparePlansPage />,
  },
  { path: "/plans/:contactId", component: <PlansPage /> },
  {
    path: "/:contactId/plan/:planId/:effectiveDate",
    component: <PlanDetailsPage />,
  },
  {
    path: "/finalexpenses/create/:contactId",
    component: <FinalExpensesPage />,
  },
  {
    path: "/planOptions/:contactId",
    component: (
      <>
        <PlanOptionsPage />
        <WebChatComponent />
      </>
    ),
  },
];

export { appRoutes, appProtectedRoutes };
