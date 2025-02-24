// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalConfig";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

async function renderApp() {
  await msalInstance.initialize();
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0 && !msalInstance.getActiveAccount()) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  );
}

renderApp();
