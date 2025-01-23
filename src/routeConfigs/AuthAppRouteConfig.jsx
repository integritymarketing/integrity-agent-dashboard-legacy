import { lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    { path: "/login", component: <ServerLoginPage /> },
    { path: "/logout", component: <ServerLogoutPage /> },
    { path: "/error", component: <ServerErrorPage /> },
    { path: "/register", component: <RegistrationPage /> },
    {
        path: "/registration-email-sent",
        component: <RegistrationCheckEmailPage />,
    },
    { path: "/confirm-email", component: <RegistrationConfirmEmailPage /> },
    {
        path: "/confirm-link-expired",
        component: <RegistrationConfirmLinkExpiredPage />,
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

export { AuthAppRoutes };
