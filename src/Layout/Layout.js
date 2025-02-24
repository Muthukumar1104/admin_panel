import React, { useState } from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="relative h-screen overflow-hidden">
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex pt-2 md:pt-2 sm:pt-0 h-[calc(100vh-4rem)]">
        <div className="hidden md:block fixed top-14 left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-200">
          <Sidebar />
        </div>

        {sidebarOpen && (
          <div className="md:hidden absolute top-14 left-0 w-full h-[calc(100vh-4rem)] bg-gray-200 z-30 transition-transform duration-300">
            <Sidebar closeSidebar={closeSidebar} />
          </div>
        )}

        <main className="flex-1 ml-0 md:ml-64 h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
