import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, pass, redirectTo = "/", ...navProps }) => {
  // const location = useLocation();
  // if (!pass)
  //   console.log("*****navigating from:", location.pathname, "to:", redirectTo);
  // else console.log("*****stay at:", location.pathname);
  return pass ? children : <Navigate to={redirectTo} {...navProps} />;
};

export default ProtectedRoute;
