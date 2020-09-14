import { UserManager, WebStorageStateStore, Log } from "oidc-client";

const IDENTITY_CONFIG = {
  authority: process.env.REACT_APP_AUTH_AUTHORITY_URL,
  client_id: process.env.REACT_APP_AUTH_CLIENT_ID,
  response_type: process.env.REACT_APP_AUTH_RESPONSE_TYPE,
  scope: process.env.REACT_APP_AUTH_SCOPES,
  redirect_uri: process.env.REACT_APP_PORTAL_URL + "/signin-oidc",
  post_logout_redirect_uri: process.env.REACT_APP_PORTAL_URL + "/signout-oidc",
  silent_redirect_uri: process.env.REACT_APP_PORTAL_URL + "/signin-oidc-silent",
};

class AuthService {
  constructor() {
    this.UserManager = new UserManager({
      ...IDENTITY_CONFIG,
      userStore: new WebStorageStateStore({ store: window.sessionStorage }),
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
      throw new Error("AuthService: " + e.message);
    });

    this.UserManager.events.addAccessTokenExpired(() => {
      Log.debug("AuthService: access token expired, starting signinSilent()");
      this.signinSilent();
    });

    this.userProfile = {};
    if (this.isAuthenticated()) {
      this.setUserProfile();
    }
  }

  _authAPIRequest = async (path, method = "GET", body = null) => {
    const user = await this.getUser();
    const opts = {
      method,
      headers: {
        Authorization: `Bearer ${user.access_token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    if (body) {
      opts.body = JSON.stringify(body);
    }

    return fetch(`${process.env.REACT_APP_AUTH_AUTHORITY_URL}${path}`, opts);
  };

  setUserProfile = async () => {
    const user = await this.getUser();
    this.userProfile = this.amendProfileWithComputedValues(user.profile);
  };

  getUser = async () => {
    const user = await this.UserManager.getUser();
    if (!user) {
      Log.debug(
        "AuthService: user undefined in getUser().  attempting signinRedirectCallback.."
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

  signinRedirectCallback = () => {
    this.UserManager.signinRedirectCallback().then(() => {
      Log.debug("AuthService: signin redirect complete");
    });
  };

  parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  signinRedirect = () => {
    localStorage.setItem("redirectUri", window.location.pathname);
    this.UserManager.signinRedirect({});
  };

  isAuthenticated = () => {
    const oidcStorage = JSON.parse(
      sessionStorage.getItem(
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
      Log.error("AuthService Error: ", err);
      return;
    }

    Log.debug("AuthService: signinSilent success!", user);
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
    this.UserManager.clearStaleState();
  };

  signoutRedirectCallback = () => {
    this.UserManager.signoutRedirectCallback().then(() => {
      localStorage.clear();
      window.location.replace("/");
    });
    this.UserManager.clearStaleState();
  };

  redirectAndRestartLoginFlow = () => {
    window.location = process.env.REACT_APP_PORTAL_URL + "/signin";
    return;
  };

  updateAccountMetadata = async (values) => {
    return this._authAPIRequest("/api/account/update", "PUT", values);
  };

  updateAccountPassword = async (values) => {
    return this._authAPIRequest("/api/account/updatepassword", "PUT", values);
  };
}

export default new AuthService();
