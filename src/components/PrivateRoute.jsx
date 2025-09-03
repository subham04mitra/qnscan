import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/jwtUtils";

const PrivateRoute = ({ role, allowedRoles, children }) => {
  const token = getToken();

  // 🚫 If no token, block access
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 If role is not allowed, also block
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Otherwise, render protected page
  return children;
};

export default PrivateRoute;
