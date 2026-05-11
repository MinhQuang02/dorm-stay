import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main Pages
import Homepage from './pages/main/Homepage';

// New Pages
import Appointment from './pages/appointment/Appointment';
import AppointmentRegister from './pages/appointment/AppointmentRegister';
import Deposit from './pages/deposit/Deposit';
import Residency from './pages/residency/Residency';
import RoomList from './pages/room-list/RoomList';
import RecordResidence from './pages/record-residence/RecordResidence';
import HandoverList     from './pages/handover/HandoverList';
import HandoverRegister from './pages/handover/HandoverRegister';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Main Routes */}
          <Route path="/" element={<Homepage />} />

          {/* Admin Features */}
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/appointment/register" element={<AppointmentRegister />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/residency" element={<Residency />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/record-residence" element={<RecordResidence />} />
          <Route path="/handover" element={<HandoverList />} />
          <Route path="/handover/register" element={<HandoverRegister />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
