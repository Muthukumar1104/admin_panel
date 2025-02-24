import React from "react";
import Layout from "../../../Layout/Layout";

const UserDashboard = () => {
  return (
    <Layout>
      <div className="card shadow p-4">
        <h2 className="card-title text-center text-3xl mb-4">User Dashboard</h2>
        <p className="text-center">
          This is the designated User object. Users have read-only access.
        </p>
      </div>
    </Layout>
  );
};

export default UserDashboard;
