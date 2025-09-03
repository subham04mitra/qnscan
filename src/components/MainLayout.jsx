import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout({ role }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        role={role}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <div
        style={{
          flexGrow: 1,            // takes all remaining space
          padding: "20px",
          transition: "all 0.3s", // smooth animation
          overflow: "auto",       // scroll if content overflows
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
