import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

function fmt(n) { return Number(n).toLocaleString('vi-VN') + 'đ'; }

export default function ContractSuccess() {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const cached = sessionStorage.getItem('contractSuccessInvoice');
    if (!cached) {
      navigate('/contract');
      return;
    }
    setInvoice(JSON.parse(cached));
  }, [navigate]);

  if (!invoice) return null;

  return (
    <MainLayout title="Contract Payment" mainClassName="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-10 md:p-16 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="#10b981" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <h2 className="text-[#cc6b34] font-['Playfair_Display'] text-4xl font-extrabold mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-500 text-[15px] mb-10 max-w-md">
          Hooray! Your monthly contract payment has been processed successfully. You can now download your receipt below.
        </p>

        {/* Transaction Details */}
        <div className="w-full bg-[#faeddb] bg-opacity-50 rounded-3xl p-8 mb-10 text-left border border-[#f0e3ce]">
          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Amount Paid</p>
              <p className="text-2xl font-black text-black">{fmt(invoice.amount)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Invoice ID</p>
              <p className="text-sm font-bold text-gray-800">#{invoice.invoiceId}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Date</p>
              <p className="text-sm font-bold text-gray-800">{new Date(invoice.paidAt).toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Contract ID</p>
              <p className="text-sm font-bold text-gray-800">#{invoice.contractId}</p>
            </div>
            <div className="col-span-2 pt-4 border-t border-dashed border-[#d8c7af]">
               <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Transaction Proof</p>
               <p className="text-xs font-mono text-gray-500 break-all">{invoice.chungTu}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link to="/" className="flex-1 bg-[#cc6b34] hover:bg-[#b55e2d] text-white font-bold py-4 rounded-2xl transition-all shadow-md text-center">
            Back to Home
          </Link>
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-white border-2 border-[#cc6b34] text-[#cc6b34] font-bold py-4 rounded-2xl hover:bg-[#faeddb] transition-all"
          >
            Download Receipt
          </button>
        </div>

        <p className="mt-8 text-gray-400 text-[11px]">
          Confirmation ID: {invoice.chungTu.slice(-8).toUpperCase()}
        </p>
      </div>
    </MainLayout>
  );
}
