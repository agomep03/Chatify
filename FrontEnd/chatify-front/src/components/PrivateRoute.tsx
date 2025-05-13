import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useEffect, useRef } from "react";
import {useAlert} from "../components/Alert";

const PrivateRoute: React.FC = () => {
  const authenticated = isAuthenticated();
  const hasAlerted = useRef(false);
  const { customAlert } = useAlert();

  useEffect(() => {
    if (!authenticated && !hasAlerted.current) {
      customAlert("error","No estás autenticado");
      hasAlerted.current = true;
    }
  }, [authenticated]);

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
