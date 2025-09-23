// src/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); // ✅ only token check

  if (!token) {
    // Redirect to login and clear any leftover tokens
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />; // redirect to login
  }

  return children;
}
