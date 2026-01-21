import {Amplify} from "aws-amplify";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";
import {ToastProvider} from "react-toast-notifications";

import "./index.css";

import App from "./App";
import {AwsConfigAuth} from "./auth/auth";
import {getBuildConstant} from "./constants/build-constants";
import {store} from "./state";
import {getAPIBaseURL} from "./utils/commonUtils";
import "devextreme/dist/css/dx.material.blue.light.css";

axios.defaults.baseURL = getAPIBaseURL();
axios.defaults.headers.common["x-api-key"] = getBuildConstant(
  "REACT_APP_X_API_KEY",
);

Amplify.configure(AwsConfigAuth);

const existingConfig = Amplify.getConfig();

const APP_URL = import.meta.env.DEV
    ? "http://localhost:5173"
    : "https://dev-hr.affooh.com";

Amplify.configure({
  ...existingConfig,
  API: {
    ...existingConfig.API,
    REST: {
      ...existingConfig.API?.REST,
      AffoohAPI: {
        endpoint: getAPIBaseURL(),
        region: "us-east-1",
      },
    },
  },
  Auth: {
    ...existingConfig.Auth,
    Cognito: {
      ...existingConfig.Auth.Cognito,
      loginWith: {
        oauth: {
          domain: "dev-auth.affooh.com",
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [`${APP_URL}/auth/callback`],
          redirectSignOut: [`${APP_URL}/logout`],
          responseType: "code", // MUST be "code"
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <ToastProvider autoDismiss={true} placement={"bottom-left"}>
        <App />
      </ToastProvider>
    </React.StrictMode>
  </Provider>,
);
