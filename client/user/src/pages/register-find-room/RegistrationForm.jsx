import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function RegistrationForm() {
  return (
    <MainLayout title="Room Rental Registration" mainClassName="flex-1 px-8 md:px-24 py-12 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Personal Info</h2>
          <p className="text-sm text-gray-500">Please fill in your information so we can support you best:</p>
        </div>

        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-600">Full Name <span className="text-gray-600">*</span></label>
            <input type="text" placeholder="Enter Full Name" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#cc6b34] transition-colors shadow-sm placeholder-gray-400" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-600">ID Card <span className="text-gray-600">*</span></label>
            <input type="text" placeholder="Enter ID number" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#cc6b34] transition-colors shadow-sm placeholder-gray-400" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-600">Phone Number <span className="text-gray-600">*</span></label>
            <input type="tel" placeholder="Enter phone number" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#cc6b34] transition-colors shadow-sm placeholder-gray-400" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-gray-600">Email <span className="text-gray-600">*</span></label>
            <input type="email" placeholder="Enter email" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#cc6b34] transition-colors shadow-sm placeholder-gray-400" />
          </div>

          <div className="mt-6">
            <button type="button" className="w-full border border-dashed border-gray-300 bg-transparent rounded-xl py-5 flex items-center justify-center gap-2 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add new Customers
            </button>
            <p className="text-[12px] text-gray-400 mt-2">Click to add a new customer.</p>
          </div>

          <div className="flex justify-between items-center mt-12">
            <Link to="/" className="px-12 py-3 rounded-lg border border-[#cc6b34] text-[#cc6b34] text-sm font-medium hover:bg-[#faeddb] transition-colors">
              Cancel
            </Link>
            <Link to="/register-find" className="px-12 py-3 rounded-lg bg-[#cc6b34] text-white text-sm font-medium hover:bg-[#b55e2d] transition-colors shadow-md">
              Next
            </Link>
          </div>
        </form>

        <div className="mt-12 mb-8 text-center">
          <p className="text-[13px] text-[#cc6b34] font-medium">*Please enter a valid phone number/email format</p>
        </div>
      </div>
    </MainLayout>
  );
}
