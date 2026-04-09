import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main Pages
import Homepage from './pages/main/Homepage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main Routes */}
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;
