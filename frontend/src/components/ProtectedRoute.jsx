import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userString = localStorage.getItem("userInfo");
  
  if (!userString) {
    // Redirect to login if user is not logged in
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);
    
    // Check if the route is restricted by roles
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to correct dashboard based on role
      return user.role === "admin" ? (
        <Navigate to="/admin" replace />
      ) : (
        <Navigate to="/dashboard" replace />
      );
    }
  } catch (error) {
    localStorage.removeItem("userInfo");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
