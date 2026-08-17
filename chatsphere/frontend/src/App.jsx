import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/chat" />} />
      <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
    </Routes>
  );
}

export default App;