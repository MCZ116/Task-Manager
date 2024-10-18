import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
