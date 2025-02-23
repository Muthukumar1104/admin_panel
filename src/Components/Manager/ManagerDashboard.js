import React from "react";
import Layout from "../../Layout/Layout";

const ManagerDashboard = () => {
  return (
    <Layout>
      <div className="card shadow p-4">
        <h2 className="card-title text-center text-3xl mb-4">
          Manager Dashboard
        </h2>
        <p className="text-center">
          This is the designated Manager object. Managers have read and write
          access.
        </p>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;
