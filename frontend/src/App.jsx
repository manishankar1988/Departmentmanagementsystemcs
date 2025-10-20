import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import HomePage from "./pages/HomePage";

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<HomePage onLogout={handleLogout} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />

      <Route
        path="/admin"
        element={user?.role === "admin" ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
      />

      <Route
        path="/staff"
        element={user?.role === "staff" ? <StaffDashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}
