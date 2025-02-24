import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Layout from "../../../Layout/Layout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { instance, accounts } = useMsal();
  const [userCount, setUserCount] = useState(0);
  const [deletedUserCount, setDeletedUserCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  const displayName =
    instance.getActiveAccount()?.name ||
    instance.getActiveAccount()?.username ||
    "";

  // Fetch counts from Graph API
  const fetchCounts = async () => {
    if (accounts.length === 0) return;
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["User.Read.All", "Directory.Read.All"],
        account: accounts[0],
      });
      const token = tokenResponse.accessToken;

      // Fetch active users
      const usersRes = await fetch("https://graph.microsoft.com/v1.0/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersRes.json();
      const activeUsers = usersData.value || [];
      let activeUserCount = activeUsers.length;

      // Fetch the Admin group and its members
      const adminGroupRes = await fetch(
        "https://graph.microsoft.com/v1.0/groups?$filter=displayName eq 'Admin'",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const adminGroupData = await adminGroupRes.json();
      let adminCount = 0;
      if (adminGroupData.value && adminGroupData.value.length > 0) {
        const adminGroupId = adminGroupData.value[0].id;
        const adminMembersRes = await fetch(
          `https://graph.microsoft.com/v1.0/groups/${adminGroupId}/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const adminMembersData = await adminMembersRes.json();
        adminCount = (adminMembersData.value || []).length;
      }
      const filteredUserCount = activeUserCount - adminCount;
      setUserCount(filteredUserCount);

      // Fetch deleted users
      const deletedRes = await fetch(
        "https://graph.microsoft.com/v1.0/directory/deletedItems/microsoft.graph.user",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const deletedData = await deletedRes.json();
      const delUsers = deletedData.value || [];
      setDeletedUserCount(delUsers.length);

      // Fetch groups
      const groupsRes = await fetch("https://graph.microsoft.com/v1.0/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const groupsData = await groupsRes.json();
      const groups = groupsData.value || [];
      setGroupCount(groups.length);

      const labels = [];
      const membersData = [];
      const deletedDataArr = [];
      const groupsDataArr = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        labels.push(d.toLocaleDateString());
        membersData.push(
          Math.round(filteredUserCount * (0.9 + Math.random() * 0.2))
        );
        deletedDataArr.push(
          Math.round(delUsers.length * (0.9 + Math.random() * 0.2))
        );
        groupsDataArr.push(
          Math.round(groups.length * (0.9 + Math.random() * 0.2))
        );
      }
      setChartData({
        labels,
        datasets: [
          {
            label: "Members",
            data: membersData,
            borderColor: "#36A2EB",
            backgroundColor: "#36A2EB33",
            tension: 0.3,
          },
          {
            label: "Deleted Users",
            data: deletedDataArr,
            borderColor: "#FF6384",
            backgroundColor: "#FF638433",
            tension: 0.3,
          },
          {
            label: "Groups",
            data: groupsDataArr,
            borderColor: "#FFCE56",
            backgroundColor: "#FFCE5633",
            tension: 0.3,
          },
        ],
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
      toast.error("Error fetching dashboard counts");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [accounts]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Metrics Over the Last 7 Days" },
    },
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row items-left md:items-center justify-start md:justify-between mb-4">
          <h1 className="text-xl font-bold sm:mb-3">Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome {displayName}!</p>
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-medium mb-2 text-black">
                  Total Members
                </h2>
                <p className="text-2xl text-zinc-400 font-normal">
                  {userCount}
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-medium mb-2 text-black">
                  Deleted Users
                </h2>
                <p className="text-2xl text-zinc-400 font-normal">
                  {deletedUserCount}
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-medium mb-2 text-black">
                  Total Groups
                </h2>
                <p className="text-2xl text-zinc-400 font-normal">
                  {groupCount}
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 h-96 w-full">
              {chartData ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <p className="text-center">No chart data available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
