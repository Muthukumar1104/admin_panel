import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate, useLocation } from "react-router-dom";
import useUserRole from "../CustomHook/useUserRole";

const RoleRedirector = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();
  const role = useUserRole();

  useEffect(() => {
    const accounts = instance.getAllAccounts();
    if (!accounts || accounts.length === 0) {
      if (location.pathname !== "/") {
        navigate("/", { replace: true });
      }
    } else if (role && location.pathname === "/") {
      if (role === "Admin") {
        navigate("/admin", { replace: true });
      } else if (role === "Manager") {
        navigate("/manager", { replace: true });
      } else if (role === "User") {
        navigate("/user", { replace: true });
      }
    }
  }, [role, instance, navigate, location.pathname]);

  return null;
};

export default RoleRedirector;
