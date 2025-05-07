import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useEffect, useRef } from "react";

const PrivateRoute: React.FC = () => {
  const authenticated = isAuthenticated();
  const hasAlerted = useRef(false);

  useEffect(() => {
    if (!authenticated && !hasAlerted.current) {
      alert("No estás autenticado");
      hasAlerted.current = true;
    }
  }, [authenticated]);

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
