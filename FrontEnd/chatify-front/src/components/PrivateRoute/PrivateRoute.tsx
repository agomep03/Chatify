import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import { useEffect } from "react";
import { useAlert } from "../Alert/Alert";

/**
 * Ruta privada que protege el acceso a rutas solo para usuarios autenticados.
 * @component
 * @returns {JSX.Element} Renderiza el contenido protegido si el usuario está autenticado, si no redirige a /login.
 * @description
 * Comprueba si el usuario está autenticado usando isAuthenticated().
 * Si no lo está, muestra una alerta y redirige a la página de login.
 * Si está autenticado, renderiza el contenido hijo mediante <Outlet />.
 */
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
