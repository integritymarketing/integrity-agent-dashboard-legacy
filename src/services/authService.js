import * as Sentry from "@sentry/react";
import { UserManager, WebStorageStateStore, Log } from "oidc-client";
import usePortalUrl from "hooks/usePortalUrl";

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
        window.location.replace("/");
      } else {
        // update userProfile after silent renew
        this.setUserProfile();
      }
    });

    this.UserManager.events.addSilentRenewError((e) => {
      throw new Error("authService: " + e.message);
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
    let portal_url = usePortalUrl();

    return {
      authority: process.env.REACT_APP_AUTH_AUTHORITY_URL,
      client_id: process.env.REACT_APP_AUTH_CLIENT_ID,
      response_type: process.env.REACT_APP_AUTH_RESPONSE_TYPE,
      scope: process.env.REACT_APP_AUTH_SCOPES,
      redirect_uri: portal_url + "/signin-oidc",
      post_logout_redirect_uri: portal_url + "/signout-oidc",
      silent_redirect_uri: portal_url + "/signin-oidc-silent",
    };
  };

  _authAPIRequest = async (path, method = "GET", body = null) => {
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

    return fetch(
      `${process.env.REACT_APP_AUTH_AUTHORITY_URL}/api/account${path}`,
      opts
    );
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
    localStorage.setItem("redirectUri", window.location.pathname);
    return this.UserManager.signinRedirect({});
  };

  isAuthenticated = () => {
    const oidcStorage = JSON.parse(
      localStorage.getItem(
        `oidc.user:${process.env.REACT_APP_AUTH_AUTHORITY_URL}:${process.env.REACT_APP_AUTH_CLIENT_ID}`
      )
    );
    return !!oidcStorage && !!oidcStorage.id_token;
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
      window.location.replace("/");
    });
  };

  redirectAndRestartLoginFlow = () => {
    let portal_url = usePortalUrl();
    window.location = portal_url + "/signin";
    return;
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

  sendConfirmationEmail = async (values) =>
    this._authAPIRequest("/resendconfirmemail", "POST", values);

  confirmEmail = async (values) =>
    this._authAPIRequest("/confirmemail", "POST", values);

  registerUser = async (values) =>
    this._authAPIRequest("/register", "POST", values);

  loginUser = async (values) => this._authAPIRequest("/login", "POST", values);

  logoutUser = async (logoutId) =>
    this._authAPIRequest(`/logout?logoutId=${logoutId}`);

  getServerError = async (errorId) => fetch(`/error?errorId=${errorId}`);

  handleExpiredToken = async () => {
    return this.signinRedirect();
  };
}

export default new authService();
