import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';

export default function DepositOutSuccess() {
  const [invoice, setInvoice] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem('depositOutInvoice');
    if (cached) setInvoice(JSON.parse(cached));
  }, []);

  const isRefund = invoice?.noHayHoan === 'HOAN';

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout title="Deposit Payment" mainClassName="flex-1 flex flex-col items-center justify-center text-center px-8 py-12">
      <div className="max-w-2xl w-full flex flex-col items-center">
        {/* Success Header */}
        <h2 className="text-5xl md:text-6xl font-extrabold text-[#ce713b] font-['Playfair_Display'] tracking-widest mb-6">
          SUCCESS
        </h2>
        <p className="text-gray-500 text-[15px] leading-relaxed max-w-lg mb-10">
          {isRefund
            ? 'Your deposit refund has been processed and recorded. The money will be transferred to your account shortly.'
            : 'Your debt payment has been confirmed and recorded. Thank you for settling your balance.'}
        </p>

        {/* Check icon */}
        <div className="mb-10">
          <div className="w-32 h-32 md:w-40 md:h-40 border-[10px] border-[#ce713b] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="4" stroke="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-[#ce713b] -mt-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
        </div>

        {/* Invoice preview card */}
        {invoice && (
          <div className={`w-full rounded-2xl border ${isRefund ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} p-6 mb-10 text-left`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-base">
                {isRefund ? '🟢 Refund Invoice' : '🔴 Debt Invoice'}
              </h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${isRefund ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isRefund ? 'REFUNDED' : 'DEBT CONFIRMED'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-gray-400 font-semibold text-xs mb-1">Invoice ID</p>
                <p className="text-gray-800 font-bold">#{invoice.invoiceId}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs mb-1">Report ID</p>
                <p className="text-gray-800 font-bold">#{invoice.reportId}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs mb-1">Contract ID</p>
                <p className="text-gray-800 font-bold">#{invoice.contractId}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs mb-1">Reference Code</p>
                <p className="text-gray-800 font-mono text-xs">{invoice.chungTu}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs mb-1">Date &amp; Time</p>
                <p className="text-gray-800 font-bold">{new Date(invoice.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs mb-1">Total Amount</p>
                <p className={`text-lg font-extrabold ${isRefund ? 'text-green-600' : 'text-red-600'}`}>
                  {invoice.amount.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>

            {showDetail && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 font-semibold mb-2">FULL TRANSACTION DETAIL</p>
                <pre className="text-xs text-left bg-white rounded-lg p-4 border border-gray-100 overflow-auto text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(invoice, null, 2)}
                </pre>
              </div>
            )}

            <button
              onClick={() => setShowDetail(!showDetail)}
              className="mt-4 text-xs text-gray-400 hover:text-[#cc6b34] transition-colors underline"
            >
              {showDetail ? 'Hide full detail' : 'View full invoice detail'}
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {invoice && (
            <button
              onClick={handlePrint}
              className="text-[13px] text-gray-400 font-medium hover:text-[#cc6b34] transition-all underline-offset-4 hover:underline flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
              </svg>
              Print invoice
            </button>
          )}
          <Link to="/" className="text-[13px] text-gray-400 font-medium hover:text-[#cc6b34] transition-all underline-offset-4 hover:underline">
            Return to home page
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
