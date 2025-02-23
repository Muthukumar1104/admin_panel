import React from "react";
import { useMsal } from "@azure/msal-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const username = activeAccount ? activeAccount.username : "User";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="bg-blue-400 text-white p-2.5 flex justify-between items-center w-full">
      <div className="text-sm md:text-md font-bold">{username}</div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-sm md:text-md py-1.5 px-3 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
