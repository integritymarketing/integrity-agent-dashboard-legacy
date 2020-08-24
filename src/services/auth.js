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

    Log.logger = console;
    Log.level = Log.DEBUG;

    this.UserManager.events.addUserLoaded(async (user) => {
      await this.setUserProfile();
      if (window.location.href.indexOf("signin-oidc") !== -1) {
        window.location.replace("/"); // redirect after userLoaded in oidc callback
      }
    });

    this.UserManager.events.addSilentRenewError((e) => {
      console.log("silent renew error", e.message);
    });

    this.UserManager.events.addAccessTokenExpired(() => {
      console.log("token expired");
      this.signinSilent();
    });

    this.userProfile = {};
    (async () => {
      await this.setUserProfile();
    })();
  }

  setUserProfile = async () => {
    let user = await this.getUser();
    this.userProfile = user.profile;
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

  signinRedirectCallback = () => {
    this.UserManager.signinRedirectCallback().then(() => {
      console.log("Signin redirect callback CALLED");
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
      console.log(err);
      return;
    }

    console.log("signinSilent Success!", user);
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
    window.location = process.env.REACT_APP_PORTAL_URL;
    return;
  };
}

export default new AuthService();
