import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { loginRequest } from "../msalConfig";

const useUserRole = () => {
  const { instance, accounts } = useMsal();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      instance
        .acquireTokenSilent({ ...loginRequest, account: accounts?.[0] })
        .then((response) => {
          const tokenClaims = response?.idTokenClaims;
          if (tokenClaims && tokenClaims?.roles) {
            setRole(tokenClaims?.roles?.[0]);
          } else {
            fetch("https://graph.microsoft.com/v1.0/me/memberOf", {
              headers: { Authorization: `Bearer ${response?.accessToken}` },
            })
              .then((res) => res.json())
              .then((data) => {
                const groups = data?.value.map((group) => group?.displayName);
                if (groups?.includes("Admin")) setRole("Admin");
                else if (groups?.includes("Manager")) setRole("Manager");
                else setRole("User");
              })
              .catch((err) => console.error("Error fetching roles", err));
          }
        })
        .catch((error) => console.error("Token acquisition error", error));
    }
  }, [accounts, instance]);

  return role;
};

export default useUserRole;
