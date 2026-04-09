import { Link } from 'react-router-dom';
import AuthLayout from '../../components/Layout/AuthLayout';

export default function ForgotPassword() {
  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      imageAlt="Hostel Dormitory"
      imagePos="right"
    >
      <div className="w-full max-w-md">
        <div className="w-12 h-12 bg-orange-100 text-[#d47435] rounded-xl flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
        </div>

        <h1 className="text-[32px] font-bold text-[#1a1f2c] mb-2">Forgot Password?</h1>
        <p className="text-[14px] text-gray-500 mb-8 leading-relaxed">
          Don't worry! It happens. Please enter the email associated with your account and we'll send an email with instructions to reset your password.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-[13px] text-gray-500 mb-1.5">E-mail address</label>
            <input type="email" placeholder="Enter your email" required
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-[14px] text-gray-700 outline-none focus:border-[#d47435] focus:ring-1 focus:ring-[#d47435] transition-all" />
          </div>

          <button type="submit" className="w-full bg-[#d47435] text-white rounded-lg py-3.5 text-[15px] font-medium hover:bg-[#c3682e] transition-colors shadow-sm">
            Send Reset Link
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-[#d47435] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
