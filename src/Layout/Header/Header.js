import React from "react";
import { useMsal } from "@azure/msal-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { instance } = useMsal();
  const { user } = useUser();
  const navigate = useNavigate();

  // Use the user from context, fallback to MSAL active account if not available
  const displayName =
    user?.displayName ||
    instance.getActiveAccount()?.name ||
    instance.getActiveAccount()?.username ||
    "";
  const trimmedName = displayName.trim();

  let initials = "";
  const nameParts = trimmedName.split(" ").filter(Boolean);
  if (nameParts.length >= 2) {
    initials = `${nameParts[0][0].toUpperCase()}${nameParts[
      nameParts.length - 1
    ][0].toUpperCase()}`;
  } else if (trimmedName.length >= 2) {
    initials = `${trimmedName[0].toUpperCase()}${trimmedName[
      trimmedName.length - 1
    ].toUpperCase()}`;
  } else {
    initials = trimmedName[0]?.toUpperCase() || "";
  }

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out");
    navigate("/");
    setInterval(() => {
      window.location.reload();
    }, 1000);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="bg-blue-400 text-white p-2 flex justify-between items-center w-full">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden focus:outline-none"
        >
          {sidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
        <div onClick={handleProfileClick} className="cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-blue-600 font-bold">
            {initials}
          </div>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-[16px] md:text-[18px] py-1.5 px-3 rounded focus:outline-none"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
