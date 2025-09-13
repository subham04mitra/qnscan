import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaUpload,
  FaFileAlt,
  FaClipboardList,
  FaEye,
  FaSignOutAlt,
} from "react-icons/fa";
import { logoutApi } from "../api/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo2.png";
import "./Sidebar.css";

const avatarImg = logo;

function Sidebar({ role, collapsed, setCollapsed }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("token");

      toast.success("Logout successful 👋", {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1600);
    } catch (error) {
      toast.error("Logout failed ❌");
    }
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <FaTachometerAlt />, roles: ["ADMIN", "TEACHER", "OWNER"] },
    { path: "/profile", label: "Profile", icon: <FaUser />, roles: ["ADMIN", "TEACHER", "OWNER"] },
    { path: "/create-user", label: "Create User", icon: <FaUser />, roles: ["ADMIN", "OWNER"] },
    { path: "/upload-paper", label: "Upload Paper", icon: <FaUpload />, roles: ["ADMIN", "TEACHER"] },
    { path: "/create-paper", label: "Create Paper", icon: <FaFileAlt />, roles: ["ADMIN", "TEACHER"] },
    { path: "/view-marks", label: "View Marks", icon: <FaClipboardList />, roles: ["ADMIN", "TEACHER", "OWNER"] },
    { path: "/view-papers", label: "View Papers", icon: <FaEye />, roles: ["ADMIN", "TEACHER", "OWNER"] },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="collapsed-user">
            <img src={avatarImg} alt="User" className="avatar" />
            {!collapsed && <span className="user-name">QnScan</span>}
          </div>
          <button className="collapse-btn" onClick={toggleSidebar}>
            {collapsed ? "➡" : "⬅"}
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="sidebar-body">
          <ul className="menu">
            {menuItems.map(
              (item) =>
                item.roles.includes(role) && (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                      <span className="icon">{item.icon}</span>
                      {!collapsed && <span className="label">{item.label}</span>}
                    </NavLink>
                  </li>
                )
            )}
          </ul>

          {/* Desktop Logout */}
          <button
            className={`logout-btn ${collapsed ? "collapsed-logout" : ""}`}
            onClick={handleLogout}
          >
            <span className="icon">
              <FaSignOutAlt />
            </span>
            {!collapsed && <span className="label">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <div className="bottom-nav-links">
          {menuItems
            .filter((item) => item.roles.includes(role))
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `bottom-nav-link ${isActive ? "active" : ""}`}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            ))}

          {/* Logout icon only */}
          <button className="logout-btn collapsed-logout" style={{margin:"5px"}} onClick={handleLogout}>
            <span className="icon">
              <FaSignOutAlt />   
            </span>
          </button>
        </div>

        {/* Gap for system nav + developer text */}
        <div className="bottom-nav-gap">
          <span className="developer-text">Developed by TechnoidHut</span>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Sidebar;
