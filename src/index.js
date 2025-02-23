// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalConfig";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "./index.css"; // Tailwind CSS (should include @tailwind directives)
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

async function renderApp() {
  // Initialize the MSAL instance before rendering
  await msalInstance.initialize();

  // Optionally, check for cached accounts and set the active account
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
