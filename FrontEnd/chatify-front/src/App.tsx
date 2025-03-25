import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><ChatPage /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
