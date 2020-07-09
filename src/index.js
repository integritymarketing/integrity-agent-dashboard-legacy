import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as Sentry from "@sentry/react";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// error logging disabled for netlify deploy-preview and branch-deploy builds
if (
  process.env.REACT_APP_SENTRY_ENV &&
  process.env.REACT_APP_SENTRY_ENV !== "disabled"
) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_SENTRY_ENV,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
