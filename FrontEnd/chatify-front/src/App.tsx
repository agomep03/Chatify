import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";

type AppProps = {
  toggleTheme: () => void;
};

const App: React.FC<AppProps> = ({ toggleTheme }) => {
  return (
    <Router>
      <Routes>
        {/* Redirige la ruta raíz a /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/home"  element={<Home toggleTheme={toggleTheme} />}  />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
