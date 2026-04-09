import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function ContractSuccess() {
  return (
    <MainLayout title="Contract Payment" mainClassName="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-10 md:p-16 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="#10b981" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <h2 className="text-[#cc6b34] font-['Playfair_Display'] text-4xl font-extrabold mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-500 text-lg mb-10 max-w-md">
          Hooray! Your payment has been processed successfully. A confirmation email has been sent to your inbox.
        </p>

        {/* Transaction Details */}
        <div className="w-full bg-[#faeddb] bg-opacity-50 rounded-2xl p-6 mb-10 text-left border border-[#f0e3ce]">
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Amount Paid</p>
              <p className="text-xl font-bold text-black">3.500.000đ</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Transaction ID</p>
              <p className="text-sm font-semibold text-gray-700">#NDS-99281044</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
              <p className="text-sm font-semibold text-gray-700">Aug 28, 2022</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Payment Method</p>
              <p className="text-sm font-semibold text-gray-700">Bank Transfer</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link to="/" className="flex-1 bg-[#cc6b34] hover:bg-[#b55e2d] text-white font-bold py-4 rounded-xl transition-all shadow-md text-center">
            Back to Home
          </Link>
          <button className="flex-1 bg-white border-2 border-[#cc6b34] text-[#cc6b34] font-bold py-4 rounded-xl hover:bg-[#faeddb] transition-all">
            View Contract
          </button>
        </div>

        <p className="mt-8 text-gray-400 text-sm">
          Having issues? <a href="mailto:mphanquang06@gmail.com" className="text-[#cc6b34] underline font-medium">Contact support</a>
        </p>
      </div>
    </MainLayout>
  );
}
