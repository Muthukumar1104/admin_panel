import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../msalConfig";
import { toast } from "react-toastify";
import Layout from "../../../Layout/Layout";

const AdminRoleManager = () => {
  const { instance, accounts } = useMsal();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [roles] = useState(["Manager", "User"]);
  const [selectedRole, setSelectedRole] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      if (!instance.getActiveAccount()) {
        instance.setActiveAccount(accounts[0]);
      }
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
          forceRefresh: true,
        })
        .then((response) => {
          fetch("https://graph.microsoft.com/v1.0/users", {
            headers: { Authorization: `Bearer ${response.accessToken}` },
          })
            .then((res) => res.json())
            .then((data) => {
              const activeUserId = instance?.getActiveAccount()?.localAccountId;
              console.log("current_user", instance?.getActiveAccount());
              const filteredUsers = data.value.filter(
                (user) => user.id !== activeUserId
              );
              setUsers(filteredUsers);
            })
            .catch((err) => {
              console.error("Error fetching users", err);
              toast.error("Error fetching users");
            });
        })
        .catch((err) => {
          console.error("Token acquisition error", err);
          toast.error("Token acquisition error");
        });
    }
  }, [instance, accounts]);

  const removeUserFromRoleGroups = async (userId, token) => {
    try {
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/users/${userId}/memberOf`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const roleGroups = data.value.filter((group) =>
        roles.includes(group.displayName)
      );
      for (const group of roleGroups) {
        await fetch(
          `https://graph.microsoft.com/v1.0/groups/${group.id}/members/${userId}/$ref`,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Error removing user from role groups", error);
      toast.error("Error removing user from role groups");
    }
  };

  const addUserToGroup = async (userId, groupId, token) => {
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/groups/${groupId}/members/$ref`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "@odata.id": `https://graph.microsoft.com/v1.0/directoryObjects/${userId}`,
        }),
      }
    );
    return res.ok;
  };

  const updateUserRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error("Please select both a user and a role.");
      return;
    }
    setIsUpdating(true);
    if (accounts.length > 0 && !instance.getActiveAccount()) {
      instance.setActiveAccount(accounts[0]);
    }
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      const token = tokenResponse.accessToken;

      await removeUserFromRoleGroups(selectedUser, token);

      const groupsRes = await fetch("https://graph.microsoft.com/v1.0/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const groupsData = await groupsRes.json();
      const group = groupsData.value.find(
        (g) => g.displayName === selectedRole
      );

      if (group) {
        const addSuccess = await addUserToGroup(selectedUser, group.id, token);
        if (addSuccess) {
          toast.success("User role updated successfully!");
        } else {
          toast.error("Failed to assign role.");
        }
      } else {
        toast.error("Role group not found in Azure AD.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error updating role");
    }
    setIsUpdating(false);
  };

  return (
    <Layout>
      <div className="container mx-auto p-8">
        <h1 className="text-xl font-bold mb-4"> Role Management</h1>
        <div className="card shadow p-4">
          <div className="mb-3">
            <label className="text-[17px] form-label">Select User</label>
            <select
              className="text-[17px] form-select"
              onChange={(e) => setSelectedUser(e.target.value)}
              value={selectedUser}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="text-[17px] form-label">Select Role</label>
            <select
              className="text-[17px] form-select"
              onChange={(e) => setSelectedRole(e.target.value)}
              value={selectedRole}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <button
              className="btn btn-success text-[17px] bg-green-500 hover:bg-green-700 border-none"
              onClick={updateUserRole}
              disabled={isUpdating}
            >
              Update User Role
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminRoleManager;
