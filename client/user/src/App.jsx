import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main Pages
import Homepage from './pages/main/Homepage';

// Register/Find Room Pages
import RegistrationForm from './pages/register-find-room/RegistrationForm';
import FindRooms from './pages/register-find-room/FindRooms';
import RegisterBooking from './pages/register-find-room/RegisterBooking';
import RegisterSuccess from './pages/register-find-room/RegisterSuccess';

// Deposit Pages
import Deposit from './pages/deposit/Deposit';
import DepositPayment from './pages/deposit/DepositPayment';
import DepositSuccess from './pages/deposit/DepositSuccess';
import DepositUpdate from './pages/deposit/DepositUpdate';

// Contract Pages
import Contract from './pages/contract/Contract';
import ContractPayment from './pages/contract/ContractPayment';
import ContractSuccess from './pages/contract/ContractSuccess';

// Deposit Out Pages
import DepositOut from './pages/deposit-out/DepositOut';
import DepositOutGetDeposit from './pages/deposit-out/DepositOutGetDeposit';
import DepositOutDebt from './pages/deposit-out/DepositOutDebt';
import DepositOutComplaint from './pages/deposit-out/DepositOutComplaint';
import DepositOutSuccess from './pages/deposit-out/DepositOutSuccess';

// Request Page
import Request from './pages/request/Request';

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

        {/* Register/Find Room Routes */}
        <Route path="/register-form" element={<RegistrationForm />} />
        <Route path="/register-find" element={<FindRooms />} />
        <Route path="/register-booking" element={<RegisterBooking />} />
        <Route path="/register-success" element={<RegisterSuccess />} />

        {/* Deposit Routes */}
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/deposit/payment" element={<DepositPayment />} />
        <Route path="/deposit/success" element={<DepositSuccess />} />
        <Route path="/deposit/update" element={<DepositUpdate />} />

        {/* Contract Routes */}
        <Route path="/contract" element={<Contract />} />
        <Route path="/contract/payment" element={<ContractPayment />} />
        <Route path="/contract/success" element={<ContractSuccess />} />

        {/* Deposit Out Routes */}
        <Route path="/deposit-out" element={<DepositOut />} />
        <Route path="/deposit-out/get-deposit" element={<DepositOutGetDeposit />} />
        <Route path="/deposit-out/debt" element={<DepositOutDebt />} />
        <Route path="/deposit-out/complaint" element={<DepositOutComplaint />} />
        <Route path="/deposit-out/success" element={<DepositOutSuccess />} />

        {/* Request Routes */}
        <Route path="/request" element={<Request />} />
      </Routes>
    </Router>
  );
}

export default App;
