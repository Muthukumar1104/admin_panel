import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../Layout/Layout";

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="card shadow p-4">
        <h2 className="card-title text-center text-3xl mb-4">
          Admin Dashboard
        </h2>
        <p className="text-center">
          This is the designated Admin object. Only Admins can view this.
        </p>
        <p className="text-center">
          Use the Role Manager
          {/* <Link to="/role-manager" className="text-blue-500 hover:underline">
            Role Manager
          </Link>{" "} */}
          to modify user access permissions.
        </p>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
