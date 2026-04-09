import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Layout/AuthLayout';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <AuthLayout
      image="https://i.postimg.cc/LX6wpSvw/DSCF3161-scaled.jpg"
      imageAlt="Hostel Room"
      imagePos="right"
      noScroll={true}
    >
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-[32px] font-bold text-[#1a1f2c] mb-1">Sign up</h1>
        <p className="text-[14px] text-gray-500 mb-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#d47435] font-medium hover:underline">Sign in</Link>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-[14px]">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-[13px] text-gray-500 mb-1.5">Username</label>
            <input 
              type="text" 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-700 outline-none focus:border-[#d47435] focus:ring-1 focus:ring-[#d47435] transition-all" 
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-500 mb-1.5">E-mail</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-700 outline-none focus:border-[#d47435] focus:ring-1 focus:ring-[#d47435] transition-all" 
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-500 mb-1.5">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-700 outline-none focus:border-[#d47435] focus:ring-1 focus:ring-[#d47435] transition-all" 
            />
          </div>

          <button type="submit" className="w-full bg-[#d47435] text-white rounded-lg py-3.5 mt-6 text-[15px] font-medium hover:bg-[#c3682e] transition-colors block text-center">
            Sign up
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
