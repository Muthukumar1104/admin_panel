import React from "react";
import Layout from "../../../Layout/Layout";
import { useMsal } from "@azure/msal-react";

const ManagerDashboard = () => {
  const { instance } = useMsal();
  const displayName =
    instance.getActiveAccount()?.name || instance.getActiveAccount()?.username;
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex align-center justify-between mb-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome {displayName} !</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl text-black font-medium mb-2">
              Total Meetings
            </h2>
            <p className="text-2xl text-zinc-400 font-normal">3</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl text-black font-medium mb-2">
              Upcoming Meetings
            </h2>
            <p className="text-2xl text-zinc-400 font-normal">1</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl text-black font-medium mb-2">
              Pending Meetings
            </h2>
            <p className="text-2xl text-zinc-400 font-normal">2</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;
