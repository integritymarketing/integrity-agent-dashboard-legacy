import * as Sentry from "@sentry/react";
import { UserManager, WebStorageStateStore, Log } from "oidc-client";
import Cookies from "universal-cookie";

const AUTH_API_VERSION = "v2.0";

const getPortalUrl = () => {
  const cookies =new Cookies();

  return (
    process.env.REACT_APP_PORTAL_URL ||
    cookies.get('portal_url') ||
    cookies.get('client_url') ||
    'https://clients.integrity.com' // Fallback URL if no other sources provide the portal URL.
  );
};

class authService {
  constructor() {
    this.UserManager = new UserManager({
      ...this._getIdentityConfig(),
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    });

    if (process.env.REACT_APP_BUILD_ENV !== "Production") {
      Log.logger = console;
      Log.level = Log.DEBUG;
    }

    this.UserManager.events.addUserLoaded((user) => {
      if (this.isAuthSuccessCallback()) {
        const redirectUrl = localStorage.getItem("redirectUri");
        if (redirectUrl) {
          localStorage.removeItem("redirectUri");
          window.location.replace(redirectUrl);
        } else {
          window.location.replace("/");
        }
      } else {
        // update userProfile after silent renew
        this.setUserProfile();
      }
    });

    this.UserManager.events.addSilentRenewError((e) => {
      throw new Error(`authService: ${  e.message}`);
    });

    this.UserManager.events.addAccessTokenExpired(() => {
      Log.debug("authService: access token expired, starting signinSilent()");
      this.signinSilent();
    });

    this.UserManager.events.addUserSignedOut(() => {
      Log.debug("authService: user signed out");
      this.logout();
    });

    this.userProfile = {};
    if (this.isAuthenticated()) {
      this.setUserProfile();
    }
  }

  _getIdentityConfig = () => {
    const portal_url = getPortalUrl();
    const cookies = new Cookies();
    const isAgentMobileSunfire =
      window.location.href.indexOf("sunfire-mobile") > -1;
    if (isAgentMobileSunfire) {
      cookies.set("sunfire_client_id", isAgentMobileSunfire);
    }
    return {
      authority: process.env.REACT_APP_AUTH_AUTHORITY_URL,
      client_id: process.env.REACT_APP_AUTH_CLIENT_ID,
      response_type: process.env.REACT_APP_AUTH_RESPONSE_TYPE,
      scope: process.env.REACT_APP_AUTH_SCOPES,
      redirect_uri: `${portal_url}/signin-oidc`,
      post_logout_redirect_uri: `${portal_url}/signout-oidc`,
      silent_redirect_uri: `${portal_url}/signin-oidc-silent`,
    };
  };

  _authAPIRequest = async (
    path,
    method = "GET",
    body = null,
    isExtranlLogin = false
  ) => {
    let user = null;
    try {
      if (this.isAuthenticated()) {
        user = await this.getUser();
      }
    } catch (error) {
      user = null;
    }
    const opts = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    if (user) {
      opts.headers.Authorization = `Bearer ${user.access_token}`;
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }

    let url = `${process.env.REACT_APP_AUTH_AUTHORITY_URL}`;
    if (isExtranlLogin) {
      url = `${url}/external${path}`;
    } else {
      url = `${url}/api/${AUTH_API_VERSION}/account${path}`;
    }

    return fetch(url, opts);
  };

  setUserProfile = async () => {
    const user = await this.getUser();
    this.userProfile = this.amendProfileWithComputedValues(user.profile);
  };

  getUser = async () => {
    const user = await this.UserManager.getUser();
    if (!user) {
      Log.debug(
        "authService: user undefined in getUser().  attempting signinRedirectCallback.."
      );
      return await this.UserManager.signinRedirectCallback();
    }
    return user;
  };

  isAuthSuccessCallback() {
    return window.location.href.indexOf("signin-oidc") !== -1;
  }

  amendProfileWithComputedValues(profile) {
    return {
      ...profile,
      get fullName() {
        return `${profile.firstName} ${profile.lastName}`;
      },
    };
  }

  signinRedirectCallback = async () => {
    try {
      await this.UserManager.signinRedirectCallback();
    } catch (error) {
      Sentry.captureException(error, {
        level: "warning",
      });
      this.UserManager.clearStaleState();
      localStorage.clear();
      throw new Error(error);
    }
  };

  parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  signinRedirect = () => {
    return this.UserManager.signinRedirect({});
  };

  isAuthenticated = () => {
    const oidcStorage = JSON.parse(
      localStorage.getItem(
        `oidc.user:${process.env.REACT_APP_AUTH_AUTHORITY_URL}:${process.env.REACT_APP_AUTH_CLIENT_ID}`
      )
    );
    return Boolean(oidcStorage) && Boolean(oidcStorage.id_token);
  };

  signinSilent = async () => {
    let user;
    try {
      user = await this.UserManager.signinSilent();
    } catch (err) {
      this.logout();
      return;
    }

    Log.debug("authService: signinSilent success!", user);
    return user;
  };

  signinSilentCallback = () => {
    this.UserManager.signinSilentCallback();
  };

  createSigninRequest = () => {
    return this.UserManager.createSigninRequest();
  };

  logout = () => {
    this.UserManager.signoutRedirect({
      id_token_hint: localStorage.getItem("id_token"),
    });
  };

  signoutRedirectCallback = () => {
    this.UserManager.signoutRedirectCallback().then(() => {
      this.UserManager.clearStaleState();
      localStorage.clear();
      window.location.href = process.env.REACT_APP_BUILD_ENV === "Production" ?`https://integrity.com/` :process.env.REACT_APP_PORTAL_URL;
    });
  };

  redirectAndRestartLoginFlow = () => {
    const portal_url = getPortalUrl();

    window.location = `${portal_url}/signin`;
    
  };

  updateAccountMetadata = async (values) =>
    this._authAPIRequest("/update", "PUT", values);

  updateAccountPassword = async (values) =>
    this._authAPIRequest("/updatepassword", "PUT", values);

  requestPasswordReset = async (values) =>
    this._authAPIRequest("/forgotpassword", "POST", values);

  resetPassword = async (values) =>
    this._authAPIRequest("/resetpassword", "POST", values);

  validatePasswordResetToken = async (values) =>
    this._authAPIRequest("/validateresetpasswordtoken", "POST", values);

  forgotUsername = async (values) =>
    this._authAPIRequest("/forgotusername", "POST", values);

  sendConfirmationEmail = async (values) =>
    this._authAPIRequest("/resendconfirmemail", "POST", values);

  confirmEmail = async (values) =>
    this._authAPIRequest("/confirmemail", "POST", values);

  registerUser = async (values) =>
    this._authAPIRequest("/register", "POST", values);

  loginUser = async (values) => {
    const resp = await this._authAPIRequest("/login", "POST", values);
    return resp;
  };

  loginUserWithClinetID = async (values, isClinetId) => {
    const resp = await this._authAPIRequest(
      "/login",
      "POST",
      values,
      isClinetId
    );
    return resp;
  };

  logoutUser = async (logoutId) =>
    this._authAPIRequest(`/logout?logoutId=${logoutId}`);

  getServerError = async (errorId) => fetch(`/error?errorId=${errorId}`);

  handleExpiredToken = async () => {
    return this.signinRedirect();
  };

  handleOpenLeadsCenter = () => {
    const userManager = new UserManager({
      authority: process.env.REACT_APP_AUTH_ILC_URL,
      client_id: "ILSClient",
      response_type: "code",
      redirect_uri: process.env.REACT_APP_AUTH_ILC_REDIRECT_URI,
      scope:
        "openid profile email phone IlsLeadManagementAPI_Full IlsOrderManagementAPI_Full IlsApplicationManagementAPI_Full IlsGatewayAPI_Full LeadsAPI_Full AgentService_Full",
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    });
    userManager.signinRedirect({
      extraQueryParams: {
        client_id: "AEPortal",
      },
    });
  };
}

const authServiceInstance = new authService();

export default authServiceInstance;
