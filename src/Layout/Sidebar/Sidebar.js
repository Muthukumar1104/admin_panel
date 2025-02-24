import React from "react";
import { NavLink } from "react-router-dom";
import useUserRole from "../../CustomHook/useUserRole";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const Sidebar = () => {
  const role = useUserRole();
  const baseStyle =
    "flex items-center space-x-2 p-2 rounded hover:bg-blue-300 hover:text-white transition-colors";
  const activeStyle = "bg-blue-400 text-white";

  let menuItems = [];
  if (role === "Admin") {
    menuItems = [
      { path: "/admin", label: "Dashboard", icon: <WidgetsOutlinedIcon /> },
      {
        path: "/role-manager",
        label: "Role Management",
        icon: <PersonAddAltOutlinedIcon />,
      },
      {
        path: "/user-management",
        label: "User Management",
        icon: <ManageAccountsOutlinedIcon />,
      },
      { path: "/profile", label: "Profile", icon: <SettingsOutlinedIcon /> },
    ];
  } else if (role === "Manager") {
    menuItems = [
      { path: "/manager", label: "Dashboard", icon: <WidgetsOutlinedIcon /> },
      { path: "/profile", label: "Profile", icon: <SettingsOutlinedIcon /> },
    ];
  } else if (role === "User") {
    menuItems = [
      { path: "/user", label: "Dashboard", icon: <WidgetsOutlinedIcon /> },
      { path: "/profile", label: "Profile", icon: <SettingsOutlinedIcon /> },
    ];
  }

  return (
    <div className="bg-gray-200 w-full md:w-64 md:h-screen h-100 p-4">
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${baseStyle} ${activeStyle}` : baseStyle
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
