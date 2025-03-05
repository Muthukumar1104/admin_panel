import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "1dee9989-1103-4b36-a17a-14ec34339c2d",
    authority:
      "https://login.microsoftonline.com/a4eaa551-a3fd-442a-ac8c-968dbe27a805",
    redirectUri: "http://localhost:3000",
    // redirectUri: "https://rbac-website.netlify.app/",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ["User.Read", "Directory.Read.All", "Directory.ReadWrite.All"],
};

export const msalInstance = new PublicClientApplication(msalConfig);
