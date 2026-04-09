import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function DepositUpdate() {
  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:border-[#cc6b34] focus:ring-1 focus:ring-[#cc6b34]";
  const labelClass = "text-[12px] font-semibold text-gray-700";

  return (
    <MainLayout title="Update Tenant Information" mainClassName="flex-1 px-6 md:px-12 mt-10 flex justify-center pb-10">
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Update Rental Information</h2>
          <p className="text-[13px] text-gray-400">Modify your booking details before deposit payment</p>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div><h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Room</h4><p className="text-[13px] text-gray-500">Private Room - A101</p></div>
          <div><h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Check-in Date</h4><p className="text-[13px] text-gray-500">20 August 2026</p></div>
          <div><h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Price</h4><p className="text-[13px] text-gray-500">$250 / month</p></div>
        </div>

        <hr className="border-gray-200 mb-8" />

        <div className="space-y-6">
          {[1, 2, 3].map((section) => (
            <div key={section} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Room / Bed</label>
                <input type="text" placeholder="Enter new room or bed" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Check-in Date</label>
                <div className="relative">
                  <input type="text" placeholder="mm/dd/yyyy" className={inputClass} />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 absolute right-3 top-2.5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Rental Duration (months)</label>
                <input type="text" placeholder="e.g. 6" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Price</label>
                <input type="text" placeholder="$" className={inputClass} />
              </div>
            </div>
          ))}
        </div>

        <hr className="border-gray-200 mt-8 mb-6" />

        <div className="flex items-center gap-3">
          <Link to="/deposit" className="bg-[#cc6b34] hover:bg-[#b55e2d] text-white text-[13px] font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm shadow-[#cc6b34]/20">
            Submit Update
          </Link>
          <Link to="/deposit" className="bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-700 text-[13px] font-medium px-6 py-2.5 rounded-lg transition-colors">
            Cancel
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
