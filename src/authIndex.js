import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import "./index.scss";
import AuthApp from "./AuthApp";
import * as serviceWorker from "./serviceWorker";
import "focus-visible";

ReactDOM.render(
  <React.StrictMode>
    <AuthApp />
  </React.StrictMode>,
  document.getElementById("root")
);

// error logging disabled for netlify deploy-preview and branch-deploy builds
// DSN only defined in production apps.  see netlify.toml
if (process.env.REACT_APP_SENTRY_AUTH_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_AUTH_DSN,
    environment: process.env.REACT_APP_BUILD_ENV || "Development",
    release: "auth-app@" + process.env.REACT_APP_VERSION,
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
