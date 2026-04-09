import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function DepositOutComplaint() {
  return (
    <MainLayout title="Deposit Payment" mainClassName="flex-1 px-6 md:px-16 py-12 flex justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 lg:gap-32">
        {/* Left - Form */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Complaint Request</h2>
          <p className="text-[13px] text-gray-500 mb-10 w-[90%] leading-relaxed">
            Please fill out my complaint form completely so we can understand the issue and try to resolve it.
          </p>

          <form className="space-y-8">
            <div>
              <input type="text" placeholder="Contract Code" className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <input type="text" placeholder="Room ID" className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" />
              <input type="text" placeholder="Bed ID" className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" />
            </div>
            <div>
              <input type="text" placeholder="Contact name" className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" />
            </div>
            <div>
              <input type="text" placeholder="Contact Phone" className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" />
            </div>
            <div>
              <input type="email" placeholder="email@gmail" className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" />
              <p className="text-[10px] text-red-500 mt-1.5">Please, enter valid email address</p>
            </div>
            <div>
              <input type="text" placeholder="Let's talk about your problems" className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors mt-2" />
            </div>

            {/* Upload */}
            <div className="mt-8">
              <div className="border border-dashed border-gray-400 rounded-sm py-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-[13px] text-gray-400">Upload Evidence file</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Attach file. File size of your documents should not exceed 10MB</p>
            </div>

            <Link to="/deposit-out" className="w-full bg-[#ce713b] text-white font-bold text-xs tracking-wider py-3.5 mt-2 rounded hover:bg-[#b55e2d] transition-colors block text-center">
              SUBMIT
            </Link>

            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input type="checkbox" className="w-3 h-3 text-[#cc6b34] border-gray-400 rounded focus:ring-[#cc6b34] bg-transparent" />
              <span className="text-[11px] text-gray-700">I confirm that I wish to file a complaint with the management.</span>
            </label>
          </form>
        </div>

        {/* Right - Contact Info */}
        <div className="flex flex-col gap-12 mt-4 lg:mt-16">
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-6">Offices</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[12px] text-gray-600">Ho Chi Minh City</p>
                <p className="text-[12px] text-gray-600 mt-0.5">500 5th Avenue Suite 400, NY 10110</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-600">Ha Noi City</p>
                <p className="text-[12px] text-gray-600 mt-0.5">High St, Bromley BR1 1DN</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-6">For Quick Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.051l-3.21-.535a2.25 2.25 0 0 0-2.26.621l-1.026 1.026c-2.839-1.503-5.09-3.754-6.593-6.593l1.026-1.026a2.25 2.25 0 0 0 .621-2.26l-.535-3.21C7.716 2.601 7.266 2.25 6.75 2.25H5.372c-1.22 0-2.203.956-2.246 2.174A14.966 14.966 0 0 0 2.25 6.75Z" />
                </svg>
                <p className="text-[12px] text-gray-600">+84 912 991 873</p>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <p className="text-[12px] text-gray-600">mphanquang06@gmail.com</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-6">Would you like to join our newsletter?</h3>
            <div className="flex items-end">
              <input type="email" placeholder="Email" className="flex-1 border-0 border-b border-gray-400 bg-transparent pb-2 text-[13px] text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" />
              <button type="button" className="bg-[#ce713b] w-10 h-10 flex items-center justify-center hover:bg-[#b55e2d] transition-colors ml-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
