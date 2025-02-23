import React from "react";
import { NavLink } from "react-router-dom";
import useUserRole from "../../CustomHook/useUserRole";

const Sidebar = () => {
  const role = useUserRole();
  const baseStyle = "block p-2 rounded hover:bg-blue-300 hover:text-white";
  const activeStyle = "bg-blue-400 text-white";

  return (
    <aside className="bg-gray-200 md:w-64 w-full md:h-screen h-auto p-4">
      <nav>
        <ul>
          {role === "Admin" && (
            <>
              <li className="mb-2">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? `${baseStyle} ${activeStyle}` : baseStyle
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/role-manager"
                  className={({ isActive }) =>
                    isActive ? `${baseStyle} ${activeStyle}` : baseStyle
                  }
                >
                  Role Manager
                </NavLink>
              </li>
            </>
          )}
          {role === "Manager" && (
            <li className="mb-2">
              <NavLink
                to="/manager"
                className={({ isActive }) =>
                  isActive ? `${baseStyle} ${activeStyle}` : baseStyle
                }
              >
                Manager Dashboard
              </NavLink>
            </li>
          )}
          {role === "User" && (
            <li className="mb-2">
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  isActive ? `${baseStyle} ${activeStyle}` : baseStyle
                }
              >
                User Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
