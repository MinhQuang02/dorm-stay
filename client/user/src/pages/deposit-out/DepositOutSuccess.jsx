import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function DepositOutSuccess() {
  return (
    <MainLayout title="Deposit Payment" mainClassName="flex-1 flex flex-col items-center justify-center text-center px-8">
      <div className="max-w-2xl w-full flex flex-col items-center">
        <h2 className="text-5xl md:text-6xl font-extrabold text-[#ce713b] font-['Playfair_Display'] tracking-widest mb-8">
          SUCCESS
        </h2>

        <p className="text-gray-500 text-[15px] md:text-[16px] leading-relaxed max-w-lg mb-12">
          The payment process was successful, more details about the invoice and how to download it can be accessed below.
        </p>

        <div className="mb-16">
          <div className="w-32 h-32 md:w-40 md:h-40 border-[10px] border-[#ce713b] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="4" stroke="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-[#ce713b] -mt-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          <a href="#" className="text-[13px] text-gray-400 font-medium hover:text-[#cc6b34] transition-all underline-offset-4 hover:underline">
            Open invoice details
          </a>
          <a href="#" className="text-[13px] text-gray-400 font-medium hover:text-[#cc6b34] transition-all underline-offset-4 hover:underline">
            Download invoice
          </a>
          <Link to="/" className="text-[13px] text-gray-400 font-medium hover:text-[#cc6b34] transition-all underline-offset-4 hover:underline">
            Return to home page
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
