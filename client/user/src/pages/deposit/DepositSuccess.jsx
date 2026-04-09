import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function DepositSuccess() {
  return (
    <MainLayout title="Deposit Payment" mainClassName="flex-1 px-6 md:px-12 mt-12 flex flex-col items-center pb-10">
      {/* Success Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mb-10">
        <div className="w-20 h-20 bg-[#f0fdf4] rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="#22c55e" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-sm text-gray-400">
          Thank you for your deposit. Your booking is now confirmed and secured. A confirmation receipt has been sent to your email.
        </p>
      </div>

      <hr className="w-full max-w-[800px] border-gray-200 mb-10" />

      {/* Transaction Summary Card */}
      <div className="w-full max-w-[700px] bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#faeddb]/30 rounded-bl-full -mr-16 -mt-16"></div>

        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#cc6b34" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375M9 18h3.375m1.875-12h7.125c.621 0 1.125.504 1.125 1.125v13.5c0 .621-.504 1.125-1.125 1.125H6.75a2.25 2.25 0 0 1-2.25-2.25V5.25a2.25 2.25 0 0 1 2.25-2.25h13.5c.621 0 1.125.504 1.125 1.125v4.875M9 6h.008v.008H9V6Z" />
          </svg>
          Transaction Summary
        </h3>

        <div className="space-y-6">
          {[
            { label: 'Transaction ID', value: 'TXN-9823048571', right: true },
            { label: 'Payment Date', value: 'April 10, 2026 - 14:25', right: true },
            { label: 'Payment Method', value: 'Bank Transfer (Vietcombank)', right: true },
            { label: 'Room / Bed', value: 'Private Office Room - A101', right: true },
          ].map((item, i) => (
            <div key={i} className="grid grid-cols-2 gap-4 border-b border-gray-50 pb-4">
              <p className="text-[13px] text-gray-400">{item.label}</p>
              <p className="text-[13px] font-bold text-gray-800 text-right uppercase">{item.value}</p>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <p className="text-[15px] font-bold text-gray-900">Total Amount Paid</p>
            <p className="text-xl font-black text-[#cc6b34] text-right">3,000,000 VND</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link to="/" className="flex-1 py-3 bg-[#cc6b34] text-white text-[13px] font-bold rounded-2xl hover:bg-[#b55e2d] transition-all shadow-md shadow-[#cc6b34]/20 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Back to Home
          </Link>
          <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 text-[13px] font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Receipt
          </button>
        </div>
      </div>

      {/* What's Next */}
      <div className="w-full max-w-[800px] mt-10 bg-[#faeddb]/50 border border-[#faeddb] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#cc6b34" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-gray-900">What's next?</h4>
            <p className="text-[12px] text-gray-500 leading-snug">Our manager will contact you within 24 hours to guide you through the check-in process and provide the smart-lock code.</p>
          </div>
        </div>
        <button className="whitespace-nowrap text-[13px] font-bold text-[#cc6b34] hover:underline transition-all">
          View My Bookings →
        </button>
      </div>
    </MainLayout>
  );
}
