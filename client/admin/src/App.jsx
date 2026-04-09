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
import Handover from './pages/handover/Handover';
import HandoverRegister from './pages/handover/HandoverRegister';
import Record from './pages/record/Record';
import RecordRegister from './pages/record/RecordRegister';
import Residency from './pages/residency/Residency';

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

        {/* Admin Features */}
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointment/register" element={<AppointmentRegister />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/handover" element={<Handover />} />
        <Route path="/handover/register" element={<HandoverRegister />} />
        <Route path="/record" element={<Record />} />
        <Route path="/record/register" element={<RecordRegister />} />
        <Route path="/residency" element={<Residency />} />
      </Routes>
    </Router>
  );
}

export default App;
