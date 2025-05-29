import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import { useEffect } from "react";
import {useAlert} from "../Alert/Alert";

const PrivateRoute: React.FC = () => {
  const authenticated = isAuthenticated();
  const { customAlert } = useAlert();

  useEffect(() => {
    if (!authenticated) {
      customAlert("error","No estás autenticado");
    }
  }, [authenticated]);

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
