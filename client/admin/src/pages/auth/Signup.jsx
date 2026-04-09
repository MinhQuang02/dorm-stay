import { Link } from 'react-router-dom';
import AuthLayout from '../../components/Layout/AuthLayout';

export default function Signup() {
  return (
    <AuthLayout
      image="https://i.postimg.cc/Cx796ds6/DSC-3743-scaled.jpg"
      imageAlt="Hostel Room"
      imagePos="left"
      maxH="h-[90vh] max-h-[780px]"
    >
      <div className="w-full max-w-md mx-auto pt-16 pb-12">
        <h1 className="text-[32px] font-bold text-[#1a1f2c] mb-6 leading-tight">Sign up</h1>

          <form className="space-y-4">
            <div>
              <label className="block text-[13px] text-gray-500 mb-1.5">Username</label>
              <input type="text" placeholder="Enter your username"
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-700 outline-none focus:border-[#d47435] focus:ring-1 focus:ring-[#d47435] transition-all" />
            </div>

            <div>
              <label className="block text-[13px] text-gray-500 mb-1.5">E-mail</label>
              <input type="email" placeholder="Enter your email"
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-700 outline-none focus:border-[#d47435] focus:ring-1 focus:ring-[#d47435] transition-all" />
            </div>

            <div>
              <label className="block text-[13px] text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <input type="password" placeholder="Enter your password"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-700 outline-none focus:border-[#d47435] focus:ring-1 focus:ring-[#d47435] transition-all pr-10" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] text-gray-500 mb-1.5">Re-enter Password</label>
              <div className="relative">
                <input type="password" placeholder="Re-enter your password"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-700 outline-none focus:border-[#d47435] focus:ring-1 focus:ring-[#d47435] transition-all pr-10" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#d47435] focus:ring-[#d47435] cursor-pointer accent-[#d47435]" />
                <span className="text-[13px] text-gray-500">Remember me</span>
              </label>
              <Link to="/login" className="text-[13px] font-medium text-[#d47435] hover:underline">Already has account?</Link>
            </div>

            <Link to="/" className="w-full bg-[#d47435] text-white rounded-lg py-3.5 text-[15px] font-medium hover:bg-[#c3682e] transition-colors block text-center">
              Sign up
            </Link>
          </form>

          <div className="flex items-center mt-5 mb-5">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-[11px] text-gray-400 uppercase font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button type="button" className="w-full bg-white border border-gray-200 rounded-lg py-3.5 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            <span className="text-[14px] text-gray-600 font-medium">Continue with Google</span>
          </button>
        </div>
    </AuthLayout>
  );
}
