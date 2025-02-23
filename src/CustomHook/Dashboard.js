// src/Dashboard.js
import React from "react";
import { Navigate } from "react-router-dom";
import useUserRole from "./useUserRole";

const Dashboard = () => {
  const role = useUserRole();

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (role === "Admin") {
    return <Navigate to="/admin" replace />;
  } else if (role === "Manager") {
    return <Navigate to="/manager" replace />;
  } else if (role === "User") {
    return <Navigate to="/user" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default Dashboard;
