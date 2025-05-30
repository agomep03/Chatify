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
import PageError from "./pages/Error";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Landing from "./pages/Landing";

type AppProps = {
  toggleTheme: () => void;
};

const App: React.FC<AppProps> = ({ toggleTheme }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing toggleTheme={toggleTheme} />} />
        <Route path="/login" element={<Login toggleTheme={toggleTheme} />} />
        <Route path="/register" element={<Register toggleTheme={toggleTheme}/>} />
        <Route path="/error" element={<PageError />} />

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
