import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Layout/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
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
        <h1 className="text-[32px] font-bold text-[#1a1f2c] mb-1">Sign in</h1>
        <p className="text-[14px] text-gray-500 mb-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#d47435] font-medium hover:underline">Create now</Link>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-[14px]">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
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
            <div className="relative">
              <input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-700 outline-none focus:border-[#d47435] focus:ring-1 focus:ring-[#d47435] transition-all pr-10" 
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#d47435] text-white rounded-lg py-3.5 mt-6 text-[15px] font-medium hover:bg-[#c3682e] transition-colors block text-center">
            Sign in
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
