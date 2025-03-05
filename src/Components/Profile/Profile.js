import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { toast } from "react-toastify";
import Layout from "../../Layout/Layout";
import useUserRole from "../../CustomHook/useUserRole";
import { useUser } from "../../Context/UserContext";

const Profile = () => {
  const { instance, accounts } = useMsal();
  const currentRole = useUserRole();
  const { user, setUser } = useUser();
  const [profile, setProfile] = useState({
    displayName: "",
    jobTitle: "",
    mobilePhone: "",
    officeLocation: "",
    userPrincipalName: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch the current user's profile using Microsoft Graph /me endpoint
  const fetchProfile = async () => {
    if (accounts.length === 0) return;
    setLoading(true);
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: accounts[0],
      });
      const token = tokenResponse.accessToken;
      const res = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const updatedProfile = {
          displayName: data.displayName || "",
          jobTitle: data.jobTitle || "",
          mobilePhone: data.mobilePhone || "",
          officeLocation: data.officeLocation || "",
          userPrincipalName: data.userPrincipalName || "",
        };
        setProfile(updatedProfile);
        setUser(updatedProfile);
      } else {
        toast.error("Failed to fetch profile: " + data.error.message);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error fetching profile");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (accounts.length > 0) {
      fetchProfile();
    }
  }, [accounts]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["User.ReadWrite"],
        account: accounts[0],
      });
      const token = tokenResponse.accessToken;
      const res = await fetch("https://graph.microsoft.com/v1.0/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: profile.displayName !== "" ? profile.displayName : null,
          jobTitle: profile.jobTitle !== "" ? profile.jobTitle : null,
          mobilePhone: profile.mobilePhone !== "" ? profile.mobilePhone : null,
          officeLocation:
            profile.officeLocation !== "" ? profile.officeLocation : null,
          userPrincipalName: profile.userPrincipalName,
        }),
      });
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setUser(profile);
      } else {
        const data = await res.json();
        toast.error("Failed to update profile: " + data.error.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile: " + error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-[17px] font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={profile.displayName}
              onChange={handleChange}
              className="w-full text-[17px] border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-[17px] text-gray-700 font-medium mb-1">
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={currentRole}
              className="w-full text-[17px] border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="userPrincipalName"
              className="block text-[17px] text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="userPrincipalName"
              name="userPrincipalName"
              type="text"
              placeholder="Email (e.g., newuser@yourtenant.onmicrosoft.com)"
              value={profile.userPrincipalName}
              onChange={handleChange}
              className="w-full text-[17px] border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-[17px] text-sm font-medium text-gray-700 mb-2"
            >
              Job Title
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={profile.jobTitle}
              onChange={handleChange}
              className="w-full text-[17px] border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="mobilePhone"
              className="block text-[17px] font-medium text-gray-700 mb-2"
            >
              Mobile Phone
            </label>
            <input
              id="mobilePhone"
              name="mobilePhone"
              type="text"
              value={profile.mobilePhone}
              onChange={handleChange}
              className="w-full text-[17px] border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="officeLocation"
              className="block text-[17px] font-medium text-gray-700 mb-2"
            >
              Office Location
            </label>
            <input
              id="officeLocation"
              name="officeLocation"
              type="text"
              value={profile.officeLocation}
              onChange={handleChange}
              className="w-full text-[17px] border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div className="text-center">
            <button
              className="btn btn-success text-[17px] bg-green-500 hover:bg-green-700 border-none"
              onClick={handleUpdateProfile}
              disabled={loading}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
