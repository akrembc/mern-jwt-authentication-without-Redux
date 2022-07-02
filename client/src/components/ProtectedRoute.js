import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, pass, redirectTo = "/", ...navProps }) => {
  console.log("nav props state", navProps.state);
  const location = useLocation();
  if (!pass)
    console.log("*****navigating from:", location.pathname, "to:", redirectTo);
  else console.log("*****stay at:", location.pathname);
  return pass ? children : <Navigate to={redirectTo} {...navProps} />;
};

export default ProtectedRoute;
