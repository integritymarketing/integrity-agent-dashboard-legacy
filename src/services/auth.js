import { UserManager, WebStorageStateStore, Log } from "oidc-client";

const IDENTITY_CONFIG = {
  authority: process.env.REACT_APP_AUTH_AUTHORITY_URL,
  client_id: process.env.REACT_APP_AUTH_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_AUTH_REDIRECT_URI,
  post_logout_redirect_uri: process.env.REACT_APP_AUTH_LOGOFF_REDIRECT_URI,
  response_type: process.env.REACT_APP_AUTH_RESPONSE_TYPE,
  scope: process.env.REACT_APP_AUTH_SCOPES,
  silent_redirect_uri: process.env.REACT_APP_AUTH_SILENT_REDIRECT_URI,
};

class AuthService {
  constructor() {
    this.UserManager = new UserManager({
      ...IDENTITY_CONFIG,
      userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    });

    Log.logger = console;
    Log.level = Log.DEBUG;

    this.UserManager.events.addUserLoaded((user) => {
      if (window.location.href.indexOf("signin-oidc") !== -1) {
        this.navigateToScreen();
      }
    });

    this.UserManager.events.addSilentRenewError((e) => {
      console.log("silent renew error", e.message);
    });

    this.UserManager.events.addAccessTokenExpired(() => {
      console.log("token expired");
      this.signinSilent();
    });
  }

  signinRedirectCallback = () => {
    this.UserManager.signinRedirectCallback().then(() => {
      console.log("Signin redirect callback CALLED");
    });
  };

  getUser = async () => {
    const user = await this.UserManager.getUser();
    if (!user) {
      return await this.UserManager.signinRedirectCallback();
    }
    this.addFullNameToUserProfile(user);
    return user;
  };

  addFullNameToUserProfile(user) {
    user.profile.fullName =
      user.profile.firstName + " " + user.profile.lastName;
  }

  parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  signinRedirect = () => {
    localStorage.setItem("redirectUri", window.location.pathname);
    this.UserManager.signinRedirect({});
  };

  navigateToScreen = () => {
    window.location.replace("/");
  };

  isAuthenticated = () => {
    const oidcStorage = JSON.parse(
      sessionStorage.getItem(
        `oidc.user:${process.env.REACT_APP_AUTH_AUTHORITY_URL}:${process.env.REACT_APP_AUTH_CLIENT_ID}`
      )
    );
    return !!oidcStorage && !!oidcStorage.id_token;
  };

  signinSilent = () => {
    this.UserManager.signinSilent()
      .then((user) => {
        console.log("signinSilent Success!", user);
      })
      .catch((err) => {
        console.log(err);
      });
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
    window.location = process.env.REACT_APP_PORTAL_URL;
    return;
  };
}

export default new AuthService();
