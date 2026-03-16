import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // redirect to login and preserve current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
