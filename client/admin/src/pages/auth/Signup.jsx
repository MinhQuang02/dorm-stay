import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Layout/AuthLayout';

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Dummy UI per instructions. Does not actually register.
    navigate('/login');
  };

  return (
    <AuthLayout
      image="https://i.postimg.cc/LX6wpSvw/DSCF3161-scaled.jpg"
      imageAlt="Hostel Room"
      imagePos="right"
      noScroll={true}
    >
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-[32px] font-bold text-[#1a1f2c] mb-1">Admin Sign up</h1>
        <p className="text-[14px] text-gray-500 mb-6">
          Admins cannot register dynamically.{' '}
          <Link to="/login" className="text-[#d47435] font-medium hover:underline">Sign in</Link>
        </p>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-[13px] text-gray-500 mb-1.5">Username</label>
            <input 
              type="text" 
              placeholder="Enter your username"
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-500 outline-none transition-all cursor-not-allowed" 
              disabled
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-500 mb-1.5">E-mail</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-500 outline-none transition-all cursor-not-allowed" 
              disabled
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-500 mb-1.5">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-500 outline-none transition-all cursor-not-allowed" 
              disabled
            />
          </div>

          <button type="submit" className="w-full bg-[#d47435] text-white rounded-lg py-3.5 mt-6 text-[15px] font-medium hover:bg-[#c3682e] transition-colors block text-center opacity-80 cursor-not-allowed" disabled>
            Sign up (Disabled)
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
