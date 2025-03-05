import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UserManagement from "./Components/Usermanagement/UserManagement";
import Profile from "./Components/Profile/Profile";
import { UserProvider } from "./Context/UserContext";

const RoleRedirector = lazy(() => import("./CustomHook/RoleRedirector"));
const Login = lazy(() => import("./Components/Login/Login"));
const AdminDashboard = lazy(() =>
  import("./Components/Dashboard/Admin/AdminDashboard")
);
const AdminRoleManager = lazy(() =>
  import("./Components/Dashboard/Admin/AdminRoleManager")
);
const ManagerDashboard = lazy(() =>
  import("./Components/Dashboard/Manager/ManagerDashboard")
);

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      }
    >
      <RoleRedirector />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/role-manager" element={<AdminRoleManager />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/user" element={<ManagerDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <ToastContainer />
        <AppRoutes />
      </Router>
    </UserProvider>
  );
};

export default App;
