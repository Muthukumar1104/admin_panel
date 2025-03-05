import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { toast } from "react-toastify";
import Layout from "../../Layout/Layout";
import Modal from "./Modal";
import UserTable from "./UserTable";
import { generatePassword } from "../../Utils/Utils";

const UserManagement = () => {
  const { instance, accounts } = useMsal();
  const [users, setUsers] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    displayName: "",
    mailNickname: "",
    userPrincipalName: "",
    password: "",
  });
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users and filter out admin users
  const fetchUsers = async () => {
    if (accounts.length > 0) {
      try {
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ["User.Read.All", "Directory.Read.All"],
          account: accounts[0],
        });
        const token = tokenResponse.accessToken;

        // Fetch all active users
        const usersRes = await fetch("https://graph.microsoft.com/v1.0/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        let activeUsers = usersData.value || [];

        // Fetch the Admin group and its members
        const adminGroupRes = await fetch(
          "https://graph.microsoft.com/v1.0/groups?$filter=displayName eq 'Admin'",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const adminGroupData = await adminGroupRes.json();
        let adminIds = [];
        if (adminGroupData.value && adminGroupData.value.length > 0) {
          const adminGroupId = adminGroupData.value[0].id;
          const adminMembersRes = await fetch(
            `https://graph.microsoft.com/v1.0/groups/${adminGroupId}/members`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const adminMembersData = await adminMembersRes.json();
          adminIds = (adminMembersData.value || []).map((member) => member.id);
        }
        // Filter out admin users from the active users list
        const filteredUsers = activeUsers.filter(
          (user) => !adminIds.includes(user.id)
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [accounts]);

  // Handlers for modals
  const openAddModal = () => {
    setNewUser({
      displayName: "",
      mailNickname: "",
      userPrincipalName: "",
      password: "",
    });
    setAutoGenerate(false);
    setShowPassword(false);
    setIsAddModalOpen(true);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = (user) => {
    setSelectedUser(user);
    setIsDeleteConfirmOpen(true);
  };

  // Create user via Graph API
  const handleAddUser = async () => {
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["Directory.ReadWrite.All", "User.ReadWrite.All"],
        account: accounts[0],
      });
      const token = tokenResponse.accessToken;
      const userPayload = {
        accountEnabled: true,
        displayName: newUser.displayName,
        mailNickname: newUser.mailNickname,
        userPrincipalName: newUser.userPrincipalName,
        passwordProfile: {
          forceChangePasswordNextSignIn: false,
          password: newUser.password,
        },
      };
      const res = await fetch("https://graph.microsoft.com/v1.0/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userPayload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("User created successfully!");
        setIsAddModalOpen(false);
        fetchUsers();
      } else {
        toast.error("Failed to create user: " + data.error.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error creating user: " + error.message);
    }
  };

  // Update user via Graph API
  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["Directory.ReadWrite.All", "User.ReadWrite.All"],
        account: accounts[0],
      });
      const token = tokenResponse.accessToken;
      const updatedPayload = {
        displayName: selectedUser.displayName,
        userPrincipalName: selectedUser.userPrincipalName,
      };
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/users/${selectedUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedPayload),
        }
      );
      if (res.ok) {
        toast.success("User updated successfully!");
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error("Failed to update user: " + data.error.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user: " + error.message);
    }
  };

  // Delete user via Graph API
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["Directory.ReadWrite.All"],
        account: accounts[0],
      });
      const token = tokenResponse.accessToken;
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/users/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        toast.success("User deleted successfully!");
        setIsDeleteConfirmOpen(false);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error("Failed to delete user: " + data.error.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user: " + error.message);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-bold mb-3 md:mb-0">User Management</h2>
          <button
            onClick={openAddModal}
            className="bg-green-500 text-[17px] hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Add User
          </button>
        </div>
        <UserTable
          users={users}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={openDeleteConfirm}
        />
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        title="Add New User"
        onClose={() => setIsAddModalOpen(false)}
      >
        <div className="space-y-4">
          <input
            type="text"
            name="displayName"
            placeholder="Enter the name"
            value={newUser.displayName}
            onChange={(e) =>
              setNewUser({ ...newUser, displayName: e.target.value })
            }
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="mailNickname"
            placeholder="Enter the mail nickname"
            value={newUser.mailNickname}
            onChange={(e) =>
              setNewUser({ ...newUser, mailNickname: e.target.value })
            }
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="email"
            name="userPrincipalName"
            placeholder="Email (e.g., newuser@yourtenant.onmicrosoft.com)"
            value={newUser.userPrincipalName}
            onChange={(e) =>
              setNewUser({ ...newUser, userPrincipalName: e.target.value })
            }
            className="border p-2 rounded w-full"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter the password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="border p-2 rounded w-full pr-10"
              required
              disabled={autoGenerate}
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a10.05 10.05 0 012.096-3.243M6.34 6.34A9.969 9.969 0 0112 5c4.478 0 8.269 2.943 9.543 7a10.05 10.05 0 01-1.248 2.453M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoGenerate"
              checked={autoGenerate}
              onChange={(e) => {
                const checked = e.target.checked;
                setAutoGenerate(checked);
                if (checked) {
                  const generated = generatePassword();
                  setNewUser({ ...newUser, password: generated });
                } else {
                  setNewUser({ ...newUser, password: "" });
                }
              }}
            />
            <label htmlFor="autoGenerate" className="text-sm">
              Auto-generate password
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        title="View User Details"
        onClose={() => setIsViewModalOpen(false)}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <strong>Name:</strong> {selectedUser.displayName}
            </div>
            <div>
              <strong>Email:</strong> {selectedUser.userPrincipalName}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        title="Edit User Details"
        onClose={() => setIsEditModalOpen(false)}
      >
        {selectedUser && (
          <div className="space-y-4">
            <input
              type="text"
              name="displayName"
              placeholder="Enter the name"
              value={selectedUser.displayName}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  displayName: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              name="userPrincipalName"
              placeholder="Email (e.g., newuser@yourtenant.onmicrosoft.com)"
              value={selectedUser.userPrincipalName}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  userPrincipalName: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        title="Confirm Delete"
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this user?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default UserManagement;
