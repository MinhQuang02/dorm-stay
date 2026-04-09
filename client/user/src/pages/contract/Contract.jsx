import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function Contract() {
  return (
    <MainLayout title="Contract Payment" mainClassName="flex-1 px-6 md:px-16 py-14 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl md:text-[32px] font-bold text-[#333333] mb-8">
          Choose your contract
        </h2>

        <div className="bg-[#faeddb] rounded-[24px] p-8 md:p-10 flex flex-col shadow-sm border border-[#f0e3ce]">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full">
            {/* Contract Icon */}
            <div className="w-48 h-48 md:w-56 md:h-56 bg-[#fde9d2] rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 25H55C68.807 25 80 36.193 80 50C80 63.807 68.807 75 55 75H25V25Z" fill="#F97316"/>
                <path d="M25 25L55 55H25V25Z" fill="#3B82F6"/>
                <path d="M25 55L55 85H80L50 55H25Z" fill="#2563EB"/>
              </svg>
            </div>

            {/* Contract Details */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-6">
                <span className="text-[19px] font-bold text-[#cc6b34]">Contract Code: </span>
                <span className="text-[19px] font-bold text-gray-600">#2020-05-0001</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                <div><p className="text-[13px] text-gray-500 font-bold mb-1">Owner</p><p className="text-[14px] text-gray-600 font-medium">Phan Quang Minh <span className="text-[#cc6b34]">(+5)</span></p></div>
                <div><p className="text-[13px] text-gray-500 font-bold mb-1">Creator</p><p className="text-[14px] text-gray-600 font-medium">Huynh Van Sinh</p></div>
                <div><p className="text-[13px] text-gray-500 font-bold mb-1">Contract Status</p><p className="text-[14px] text-gray-600 font-medium">Deposit can refunded</p></div>
                <div><p className="text-[13px] text-gray-500 font-bold mb-1">Form of Rental</p><p className="text-[14px] text-gray-600 font-medium">By Bed</p></div>
                <div><p className="text-[13px] text-gray-500 font-bold mb-1">Start Date</p><p className="text-[14px] text-gray-600 font-medium">20/11/2025</p></div>
                <div><p className="text-[13px] text-gray-500 font-bold mb-1">Payment Period</p><p className="text-[14px] text-gray-600 font-medium">The 5th</p></div>
                <div><p className="text-[13px] text-gray-500 font-bold mb-1">Creation Date</p><p className="text-[14px] text-gray-600 font-medium">17/11/2025</p></div>
                <div><p className="text-[13px] text-gray-500 font-bold mb-1">End Date</p><p className="text-[14px] text-gray-600 font-medium">26/03/2026</p></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 w-full">
            <a href="mailto:mphanquang06@gmail.com" className="bg-[#f0dfcc] hover:bg-[#e6d3bd] text-[#cc6b34] text-[13px] font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a15.26 15.26 0 0 1 9.46 0l2.77.693M3 15h18M3 4.5h18m-9-1.5v1.5m0 12v1.5" />
              </svg>
              Report this
            </a>
            <Link to="/contract/payment" className="bg-[#cc6b34] hover:bg-[#b55e2d] text-white text-[14px] font-semibold px-8 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md">
              Continue
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
