import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaUpload,
  FaFileAlt,
  FaClipboardList,
  FaEye,
  FaSignOutAlt,
} from "react-icons/fa";
import { logoutApi } from "../api/authService";
import "./Sidebar.css";
import { ToastContainer, toast } from "react-toastify"; // ✅ correct import
import "react-toastify/dist/ReactToastify.css"; // ✅ include styles
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
const avatarImg =logo;

function Sidebar({ role, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
    const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("token");

      // ✅ show toast
      toast.success("Logout successful 👋", {
        position: "top-right",
        autoClose: 1500,
      });

      // ✅ reload after short delay
      setTimeout(() => {
          navigate("/login", { replace: true }); // redirect to dashboard -> MainLayout -> sidebar
        }, 1600);
    } catch (error) {
      toast.error("Logout failed ❌");
    }
  };



  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

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
      {/* Mobile burger */}
      <div className="mobile-burger" onClick={toggleMobileSidebar}>
        ☰
      </div>

      <div
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
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
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                      onClick={() => mobileOpen && setMobileOpen(false)}
                    >
                      <span className="icon">{item.icon}</span>
                      {!collapsed && <span className="label">{item.label}</span>}
                    </NavLink>
                  </li>
                )
            )}
          </ul>

          {/* Logout at Bottom */}
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

      {/* ✅ Toast container */}
      <ToastContainer />
    </>
  );
}

export default Sidebar;
