// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import MainLayout from "./components/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import CreateUser from "./pages/CreateUser";
import UploadPaper from "./pages/UploadPaper";
import CreatePaper from "./pages/CreatePaper";
import ViewMarks from "./pages/ViewMarks";
import ViewPapers from "./pages/ViewPapers";
import Profile from "./pages/Profile";
import { refreshTokenApi } from "./api/authService";
import { decodeToken, getToken } from "./utils/jwtUtils";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import ExamPaperViewer from "./pages/ExamPaperViewer";
function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Track token check

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      setRole(decoded?.role);
    }
    setLoading(false); // token check done

    // Refresh token every 26 minutes
    const interval = setInterval(() => {
      refreshTokenApi();
    }, 26 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    // Loading animation
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading, please wait...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login Page */}
      <Route
        path="/login"
        element={<LoginForm onLogin={(decodedRole) => setRole(decodedRole)} />}
      />
<Route
        path="/test"
        element={<ExamPaperViewer/>}
      />
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute
            role={role}
            allowedRoles={["ADMIN", "TEACHER", "OWNER", "STUDENT"]}
          >
            <MainLayout role={role} />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* ADMIN only */}
        <Route
          path="manage-users"
          element={
            <PrivateRoute role={role} allowedRoles={["ADMIN"]}>
              <ManageUsers />
            </PrivateRoute>
          }
        />

        {/* ADMIN, OWNER */}
        <Route
          path="create-user"
          element={
            <PrivateRoute role={role} allowedRoles={["ADMIN", "OWNER"]}>
              <CreateUser />
            </PrivateRoute>
          }
        />

        {/* ADMIN, TEACHER */}
        <Route
          path="upload-paper"
          element={
            <PrivateRoute role={role} allowedRoles={["ADMIN", "TEACHER"]}>
              <UploadPaper />
            </PrivateRoute>
          }
        />
        <Route
          path="create-paper"
          element={
            <PrivateRoute role={role} allowedRoles={["ADMIN", "TEACHER"]}>
              <CreatePaper />
            </PrivateRoute>
          }
        />

        {/* ADMIN, TEACHER, OWNER */}
        <Route
          path="view-marks"
          element={
            <PrivateRoute role={role} allowedRoles={["ADMIN", "TEACHER", "OWNER"]}>
              <ViewMarks />
            </PrivateRoute>
          }
        />
        <Route
          path="view-papers"
          element={
            <PrivateRoute role={role} allowedRoles={["ADMIN", "TEACHER", "OWNER"]}>
              <ViewPapers />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute role={role} allowedRoles={["ADMIN", "TEACHER", "OWNER"]}>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
