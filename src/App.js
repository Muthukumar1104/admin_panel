import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useUserRole from "./CustomHook/useUserRole";
import Login from "./Components/Login/Login";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminRoleManager from "./Components/Admin/AdminRoleManager";
import ManagerDashboard from "./Components/Manager/ManagerDashboard";
import UserDashboard from "./Components/User/UserDashboard";
import { msalInstance } from "./msalConfig";

const AppRoutes = () => {
  const role = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accounts = msalInstance.getAllAccounts();

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
  }, [role, navigate, location.pathname]);

  console.log("boooooommmerrrr", role);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/role-manager" element={<AdminRoleManager />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <AppRoutes />
    </Router>
  );
};

export default App;
